import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

function run(...args) {
  return spawnSync(process.execPath, ['checker.js', ...args], {encoding: 'utf8'});
}

async function tempJson(source, mutate) {
  const dir = await mkdtemp(join(tmpdir(), 'review-lab-'));
  const value = JSON.parse(await readFile(source, 'utf8'));
  mutate(value);
  const path = join(dir, 'fixture.json');
  await writeFile(path, JSON.stringify(value, null, 2));
  return path;
}

const baselinePass = 'STRUCTURAL PASS\nPOLICY PASS\nDECISION escalate\nCRITERIA verified=2 failed=2 unknown=1\nRESULT PASS\n';
const changedPass = 'STRUCTURAL PASS\nPOLICY PASS\nDECISION accept\nCRITERIA verified=5 failed=0 unknown=0\nRESULT PASS\n';

test('worked baseline packet passes with exact output', () => {
  const result = run('validate', 'fixtures/baseline-dossier.json', 'submissions/solution.json');
  assert.equal(result.status, 0);
  assert.equal(result.stdout, baselinePass);
});

test('independent changed-input solution passes', () => {
  const result = run('validate', 'fixtures/changed-dossier.json', 'submissions/changed-solution.json');
  assert.equal(result.status, 0);
  assert.equal(result.stdout, changedPass);
});

test('mechanically valid blanket acceptance fails policy', () => {
  const result = run('validate', 'fixtures/baseline-dossier.json', 'submissions/flawed.json');
  assert.equal(result.status, 1);
  assert.equal(result.stdout, 'STRUCTURAL PASS\nPOLICY FAIL\n- criterion C1 packet=verified evidence=failed\n- criterion C4 packet=verified evidence=unknown\n- decision packet=accept evidence=escalate\nRESULT FAIL\n');
});

test('inspect derives the current observation instead of replaying documentation', async () => {
  const dossierPath = await tempJson('fixtures/changed-dossier.json', dossier => {
    dossier.evidence.find(item => item.id === 'state-note').observation.value = false;
  });
  const result = run('inspect', dossierPath, 'check-note-state');
  assert.equal(result.status, 1);
  assert.equal(result.stdout, 'CHECK check-note-state\nrevision state-lyra-r3\nobserved internal_note_present=false\nresult FAIL\n');
});

test('stale reproduced and documented output fail after observation changes', async () => {
  const dossierPath = await tempJson('fixtures/changed-dossier.json', dossier => {
    dossier.evidence.find(item => item.id === 'state-note').observation.value = false;
  });
  const result = run('validate', dossierPath, 'submissions/changed-solution.json');
  assert.equal(result.status, 1);
  assert.match(result.stdout, /check check-note-state documented output stale/);
  assert.match(result.stdout, /check check-note-state output mismatch/);
});

test('empty criterion evidence is rejected', async () => {
  const packetPath = await tempJson('submissions/solution.json', packet => {
    packet.criteria[0].evidenceRefs = [];
  });
  const result = run('validate', 'fixtures/baseline-dossier.json', packetPath);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /criterion C1 requires relevant evidenceRefs/);
  assert.match(result.stdout, /criterion C1 missing evidence source-policy-current@policy-orion-basic-r3/);
});

test('unrelated but valid criterion evidence is rejected', async () => {
  const packetPath = await tempJson('submissions/solution.json', packet => {
    packet.criteria[1].evidenceRefs.push({id: 'test-format', revision: 'test-r9'});
  });
  const result = run('validate', 'fixtures/baseline-dossier.json', packetPath);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /criterion C2 unrelated evidence test-format@test-r9/);
});

test('dangling criterion evidence is rejected', async () => {
  const packetPath = await tempJson('submissions/solution.json', packet => {
    packet.criteria[1].evidenceRefs[0] = {id: 'missing-state', revision: 'r1'};
  });
  const result = run('validate', 'fixtures/baseline-dossier.json', packetPath);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /criterion C2 dangling evidence missing-state@r1/);
});

test('wrong source revision in human claim review is rejected', async () => {
  const packetPath = await tempJson('submissions/solution.json', packet => {
    packet.claimReviews[1].sourceRefs[0].revision = 'policy-orion-basic-wrong';
  });
  const result = run('validate', 'fixtures/baseline-dossier.json', packetPath);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /claim review claim-escalation-window dangling source policy-current@policy-orion-basic-wrong/);
});

test('mismatched tenant binding in dossier is rejected', async () => {
  const dossierPath = await tempJson('fixtures/baseline-dossier.json', dossier => {
    dossier.evidence.find(item => item.id === 'trace-send').binding.tenant = 'tenant-other';
  });
  const result = run('validate', dossierPath, 'submissions/solution.json');
  assert.equal(result.status, 1);
  assert.match(result.stdout, /evidence trace-send@trace-r7 tenant binding mismatch/);
});

test('authorization rejects a different actor', async () => {
  const dossierPath = await tempJson('fixtures/changed-dossier.json', dossier => {
    dossier.evidence.find(item => item.id === 'trace-note').identity = 'different-synthetic-actor';
  });
  const result = run('validate', dossierPath, 'submissions/changed-solution.json');
  assert.equal(result.status, 1);
  assert.match(result.stdout, /criterion C3 packet=verified evidence=failed/);
});

test('dangling rule evidence is rejected without crashing', async () => {
  const dossierPath = await tempJson('fixtures/baseline-dossier.json', dossier => {
    dossier.workOrder.criteria[1].rule.evidenceRef = {id: 'missing-state', revision: 'r0'};
  });
  const result = run('validate', dossierPath, 'submissions/solution.json');
  assert.equal(result.status, 1);
  assert.match(result.stdout, /criterion C2 dangling rule evidence missing-state@r0/);
  assert.doesNotMatch(result.stderr, /TypeError/);
});

test('malformed rule is rejected without crashing', async () => {
  const dossierPath = await tempJson('fixtures/baseline-dossier.json', dossier => {
    dossier.workOrder.criteria[2].rule = {type: 'authorized_action', authorizationRef: null};
  });
  const result = run('validate', dossierPath, 'submissions/solution.json');
  assert.equal(result.status, 1);
  assert.match(result.stdout, /criterion C3 malformed authorizationRef/);
  assert.match(result.stdout, /criterion C3 malformed traceRef/);
  assert.doesNotMatch(result.stderr, /TypeError/);
});

test('CRLF JSON input and reproduced output are normalized', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'review-lab-'));
  const dossierText = (await readFile('fixtures/baseline-dossier.json', 'utf8')).replace(/\n/g, '\r\n');
  const packetText = (await readFile('submissions/solution.json', 'utf8')).replace(/\n/g, '\r\n');
  const dossierPath = join(dir, 'dossier.json');
  const packetPath = join(dir, 'packet.json');
  await writeFile(dossierPath, dossierText);
  await writeFile(packetPath, packetText);
  const result = run('validate', dossierPath, packetPath);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, baselinePass);
});

test('baseline inspect output is exact', () => {
  const result = run('inspect', 'fixtures/baseline-dossier.json', 'check-draft-state');
  assert.equal(result.status, 0);
  assert.equal(result.stdout, 'CHECK check-draft-state\nrevision state-orion-2026-09-20-r4\nobserved draft_present=true\nresult PASS\n');
});
