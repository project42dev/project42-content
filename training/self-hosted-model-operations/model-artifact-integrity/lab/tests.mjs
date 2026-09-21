import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { webcrypto } from 'node:crypto';

const lab = dirname(fileURLToPath(import.meta.url));
const workspaces = join(lab, '.test-workspaces');
const learner = join(lab, 'verify.mjs');
const reference = join(lab, 'reference', 'verify.mjs');
const baselineManifestText = await readFile(join(lab, 'manifest.json'), 'utf8');
const baselineEmpty = await readFile(join(lab, 'fixtures', 'artifact.bin'));
const baselineText = await readFile(join(lab, 'fixtures', 'tokenizer.txt'));
const sha256 = async bytes => Buffer.from(await webcrypto.subtle.digest('SHA-256', bytes)).toString('hex');
const run = (script, workspace) => new Promise(resolveRun => {
  const child = spawn(process.execPath, [script, workspace], { stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', chunk => stdout += chunk);
  child.stderr.on('data', chunk => stderr += chunk);
  child.on('close', code => resolveRun({ code, stdout, stderr }));
});
const assert = (condition, name, detail = '') => {
  if (!condition) throw new Error(`TEST FAIL ${name}${detail ? `: ${detail}` : ''}`);
  console.log(`TEST PASS ${name}`);
};
const fresh = async name => {
  const workspace = join(workspaces, name);
  await rm(workspace, { recursive: true, force: true });
  await mkdir(join(workspace, 'fixtures'), { recursive: true });
  await writeFile(join(workspace, 'manifest.json'), baselineManifestText);
  await writeFile(join(workspace, 'fixtures', 'artifact.bin'), baselineEmpty);
  await writeFile(join(workspace, 'fixtures', 'tokenizer.txt'), baselineText);
  return workspace;
};
const readManifest = async workspace => JSON.parse(await readFile(join(workspace, 'manifest.json'), 'utf8'));
const writeManifest = async (workspace, manifest) => writeFile(join(workspace, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
const passSuffix = 'PROMOTION PASS bundle=local-fixture-v1\n';

await rm(workspaces, { recursive: true, force: true });
await mkdir(workspaces, { recursive: true });

let workspace = await fresh('immutable');
let result = await run(learner, workspace);
assert(result.code === 0 && result.stderr === '' && result.stdout.endsWith(passSuffix), 'immutable promotion');

workspace = await fresh('same-length-tamper');
await writeFile(join(workspace, 'fixtures', 'tokenizer.txt'), Buffer.from('abd', 'utf8'));
result = await run(learner, workspace);
const exactTamper = 'INVENTORY PASS files=2\nDIGEST PASS fixtures/artifact.bin e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\nDIGEST REJECT fixtures/tokenizer.txt expected=ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad observed=a52d159f262b2c6ddb724a61840befc36eb30c88877a4030b65cbe86298449c9\nPROMOTION REJECT digest-mismatch\n';
assert(result.code === 1 && result.stderr === '' && result.stdout === exactTamper, 'same-length tamper rejection');

workspace = await fresh('changed-trusted-input');
const changedBytes = Buffer.from('abd', 'utf8');
const changedDigest = await sha256(changedBytes);
if (changedDigest !== 'a52d159f262b2c6ddb724a61840befc36eb30c88877a4030b65cbe86298449c9') throw new Error('TEST FAIL independent SHA-256 expectation');
await writeFile(join(workspace, 'fixtures', 'tokenizer.txt'), changedBytes);
let manifest = await readManifest(workspace);
manifest.inventory.find(entry => entry.path === 'fixtures/tokenizer.txt').sha256 = changedDigest;
manifest.promotion.inventoryBinding = manifest.inventory.slice().sort((a, b) => a.path.localeCompare(b.path)).map(entry => `${entry.path}=${entry.sha256}`).join('|');
await writeManifest(workspace, manifest);
result = await run(learner, workspace);
assert(result.code === 0 && result.stderr === '' && result.stdout.includes(`DIGEST PASS fixtures/tokenizer.txt ${changedDigest}`) && result.stdout.endsWith(passSuffix), 'changed trusted input promotion');

workspace = await fresh('size-rejection');
await writeFile(join(workspace, 'fixtures', 'artifact.bin'), Buffer.from([1]));
result = await run(learner, workspace);
assert(result.code === 1 && result.stdout.endsWith('REJECT size-mismatch fixtures/artifact.bin expected=0 observed=1\n'), 'accurate size rejection');

workspace = await fresh('unlisted');
await writeFile(join(workspace, 'fixtures', 'extra.bin'), Buffer.from('x'));
result = await run(learner, workspace);
assert(result.code === 1 && result.stdout === 'REJECT unlisted-artifact fixtures/extra.bin\n', 'unlisted artifact rejection');

workspace = await fresh('duplicate');
manifest = await readManifest(workspace);
manifest.inventory.push({ ...manifest.inventory[0] });
await writeManifest(workspace, manifest);
result = await run(learner, workspace);
assert(result.code === 1 && result.stdout === 'REJECT duplicate-inventory-path fixtures/artifact.bin\n', 'duplicate inventory rejection');

workspace = await fresh('absolute');
manifest = await readManifest(workspace);
manifest.inventory[0].path = 'C:/escape.bin';
await writeManifest(workspace, manifest);
result = await run(learner, workspace);
assert(result.code === 1 && result.stdout === 'REJECT unsafe-path C:/escape.bin\n', 'absolute path rejection');

workspace = await fresh('sbom');
manifest = await readManifest(workspace);
manifest.sbom.components = ['fixtures/artifact.bin'];
await writeManifest(workspace, manifest);
result = await run(learner, workspace);
assert(result.code === 1 && result.stdout.endsWith('REJECT sbom-inventory-mismatch\n'), 'SBOM mismatch rejection');

workspace = await fresh('reference');
const learnerResult = await run(learner, workspace);
const referenceResult = await run(reference, workspace);
assert(referenceResult.code === 0 && learnerResult.code === referenceResult.code && learnerResult.stdout === referenceResult.stdout && referenceResult.stderr === '', 'reference agreement');

const afterManifest = await readFile(join(lab, 'manifest.json'), 'utf8');
const afterEmpty = await readFile(join(lab, 'fixtures', 'artifact.bin'));
const afterText = await readFile(join(lab, 'fixtures', 'tokenizer.txt'));
assert(afterManifest === baselineManifestText && Buffer.compare(afterEmpty, baselineEmpty) === 0 && Buffer.compare(afterText, baselineText) === 0, 'source fixture immutability');
console.log('TEST SUMMARY 10 passed');
