import { mkdtemp, cp, readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const target = process.argv[2];
if (!target) throw new Error('validator path required');

const lab = resolve(import.meta.dirname, '..');
const targetPath = resolve(lab, target);
const workspaceBase = join(lab, '.test-workspaces');
const expectedCriterionIds = [
  'reliable-capstone-correctness',
  'reliable-capstone-safety',
  'reliable-capstone-evidence',
  'reliable-capstone-reliability',
  'reliable-capstone-maintainability',
  'reliable-capstone-communication'
];

assertStrictlyContained(lab, targetPath, 'validator path');
await mkdir(workspaceBase, { recursive: true });
const runRoot = await mkdtemp(join(workspaceBase, 'run-'));

let passed = 0;
let failed = 0;

function assertStrictlyContained(parent, candidate, label) {
  const parentPath = resolve(parent);
  const candidatePath = resolve(candidate);
  const rel = relative(parentPath, candidatePath);
  if (rel === '' || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    throw new Error(`${label} is outside its required container: ${candidatePath}`);
  }
}

async function removeWorkspace(path) {
  assertStrictlyContained(workspaceBase, path, 'recursive deletion target');
  await rm(path, { recursive: true, force: true });
}

async function test(name, fn) {
  try {
    await fn();
    console.log(`PASS ${name}`);
    passed++;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`FAIL ${name}: ${message}`);
    failed++;
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

async function variant(mutator) {
  const root = await mkdtemp(join(runRoot, 'case-'));
  const dir = join(root, 'package');
  await cp(join(lab, 'fixtures', 'revised'), dir, { recursive: true });
  await mutator(dir);
  return { root, dir };
}

async function withVariant(mutator, assertion) {
  const v = await variant(mutator);
  try {
    await assertion(v.dir);
  } finally {
    await removeWorkspace(v.root);
  }
}

async function editEvaluation(dir, edit) {
  const path = join(dir, 'evaluation-set-and-rubric.json');
  const value = JSON.parse(await readFile(path, 'utf8'));
  edit(value);
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function validateMutation(validatePackage, edit, expectedCode, cause) {
  await withVariant(
    async (dir) => editEvaluation(dir, edit),
    async (dir) => {
      const result = await validatePackage(dir);
      expect(
        !result.valid && result.code === expectedCode,
        `${cause} must produce ${expectedCode}; received ${JSON.stringify(result)}`
      );
    }
  );
}

try {
  // Import the requested validator directly. Its relative import therefore resolves
  // to the supplied shared validator rather than to a generated or mocked module.
  const targetUrl = pathToFileURL(targetPath);
  targetUrl.searchParams.set('run', `${process.pid}-${Date.now()}`);
  const module = await import(targetUrl.href);
  expect(typeof module.validatePackage === 'function', 'target must export validatePackage');
  const validatePackage = module.validatePackage;

  await test('stale binding rejected', async () => {
    const result = await validatePackage(join(lab, 'fixtures', 'failed'));
    expect(
      !result.valid && result.code === 'E_BINDING',
      `stale evidence must be rejected with E_BINDING; received ${JSON.stringify(result)}`
    );
  });

  await test('revised package accepted with all 6 criteria', async () => {
    const fixtureDir = join(lab, 'fixtures', 'revised');
    const evaluation = JSON.parse(
      await readFile(join(fixtureDir, 'evaluation-set-and-rubric.json'), 'utf8')
    );
    const ids = evaluation.criterionScores?.map((item) => item.criterionId);
    expect(
      Array.isArray(ids) &&
        ids.length === expectedCriterionIds.length &&
        new Set(ids).size === expectedCriterionIds.length &&
        expectedCriterionIds.every((id) => ids.includes(id)),
      `revised fixture must contain each of the 6 stable criterion IDs exactly once; received ${JSON.stringify(ids)}`
    );

    const result = await validatePackage(fixtureDir);
    expect(
      result.valid && result.score === 80 && result.passed,
      `revised fixture must be valid with score 80 and passed=true; received ${JSON.stringify(result)}`
    );
  });

  await test('complete package accepted at the 100 point bound', async () => {
    const result = await validatePackage(join(lab, 'fixtures', 'complete'));
    expect(
      result.valid && result.score === 100 && result.passed,
      `complete fixture must be valid with score 100 and passed=true; received ${JSON.stringify(result)}`
    );
  });

  await test('unsafe evidence reference rejected', async () => {
    await validateMutation(
      validatePackage,
      (evaluation) => {
        evaluation.criterionScores[0].evidenceRefs[0] = '../architecture-and-state-model.md';
      },
      'E_REFERENCE',
      'a parent-directory evidence reference'
    );
  });

  await test('independent changed case accepted', async () => {
    await withVariant(
      async (dir) => {
        for (const name of [
          'architecture-and-state-model.md',
          'tool-inventory-and-permission-matrix.md',
          'trust-boundary-and-threat-model.md',
          'failure-tests-and-results.md',
          'observability-plan.md',
          'operating-runbook.md',
          'evidence-map-and-handoff.md'
        ]) {
          const path = join(dir, name);
          const text = await readFile(path, 'utf8');
          await writeFile(path, text.replaceAll('support-017', 'support-099'));
        }
        await editEvaluation(dir, (evaluation) => {
          evaluation.manifest.caseId = 'support-099';
          evaluation.binding.caseId = 'support-099';
          evaluation.input.caseId = 'support-099';
          evaluation.input.text = 'Changed fixture: duplicate draft request after timeout.';
        });
      },
      async (dir) => {
        const result = await validatePackage(dir);
        expect(
          result.valid && result.score === 80 && result.passed,
          `consistently changing the case binding must remain valid at score 80; received ${JSON.stringify(result)}`
        );
      }
    );
  });

  await test('unknown criterion rejected by supplied shared logic', async () => {
    await validateMutation(
      validatePackage,
      (evaluation) => {
        evaluation.criterionScores[0].criterionId = 'invented';
      },
      'E_CRITERION_ID',
      'an unknown criterion ID'
    );
  });

  await test('malformed and out-of-bound points rejected by supplied shared logic', async () => {
    await validateMutation(
      validatePackage,
      (evaluation) => {
        evaluation.criterionScores[0].pointsAwarded = '20';
      },
      'E_POINTS',
      'a string-valued points award'
    );
    await validateMutation(
      validatePackage,
      (evaluation) => {
        evaluation.criterionScores[0].pointsAwarded = 21;
      },
      'E_POINTS',
      'a 21 point award above the correctness criterion maximum of 20'
    );
  });

  await test('declared sum mismatch rejected by supplied shared logic', async () => {
    await validateMutation(
      validatePackage,
      (evaluation) => {
        evaluation.declaredTotal = 81;
      },
      'E_SUM',
      'a declared total that differs from the criterion score sum'
    );
  });
} finally {
  await removeWorkspace(runRoot);
}

console.log(`TESTS total=${passed + failed} passed=${passed} failed=${failed}`);
if (failed) process.exitCode = 1;
