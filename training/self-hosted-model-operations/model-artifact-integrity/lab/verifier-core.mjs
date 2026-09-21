import { readFile, readdir, lstat, realpath } from 'node:fs/promises';
import { resolve, relative, isAbsolute, sep, posix } from 'node:path';
import { webcrypto } from 'node:crypto';

const trusted = Object.freeze({
  bundleId: 'local-fixture-v1',
  sourceRevision: 'fixture-revision-20260913',
  builder: 'project-42-fixture-builder',
  policy: 'local-inert-fixture-only',
  maxFiles: 8,
  maxFileBytes: 1048576,
  maxTotalBytes: 2097152
});

class ControlledReject extends Error {}
const hex = value => Buffer.from(value).toString('hex');
const inside = (base, candidate) => {
  const rel = relative(base, candidate);
  return rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
};
const stop = (...lines) => {
  for (const line of lines) console.log(line);
  throw new ControlledReject(lines.at(-1));
};
const ordinaryObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export async function verifyWorkspace(workspace, selectExpectedBinding) {
  const root = resolve(workspace);
  try {
    const rootStat = await lstat(root);
    if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) stop('REJECT unsafe-workspace-root');
    const rootReal = await realpath(root);
    const manifestPath = resolve(root, 'manifest.json');
    if (!inside(root, manifestPath)) stop('REJECT manifest-path-escape');
    const manifestStat = await lstat(manifestPath);
    if (manifestStat.isSymbolicLink() || !manifestStat.isFile()) stop('REJECT unsafe-manifest');

    let manifest;
    try {
      manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    } catch {
      stop('REJECT malformed-manifest-json');
    }
    if (!ordinaryObject(manifest) || manifest.schemaVersion !== '1.0') stop('REJECT malformed-manifest');
    if (manifest.bundleId !== trusted.bundleId || manifest.source?.revision !== trusted.sourceRevision) stop('REJECT untrusted-fixture-identity');
    if (manifest.policy?.name !== trusted.policy || manifest.policy?.maxFiles !== trusted.maxFiles || manifest.policy?.maxFileBytes !== trusted.maxFileBytes || manifest.policy?.maxTotalBytes !== trusted.maxTotalBytes || manifest.policy?.serving !== false) stop('REJECT malformed-or-untrusted-policy');
    if (!Array.isArray(manifest.inventory) || manifest.inventory.length < 1 || manifest.inventory.length > trusted.maxFiles) stop('REJECT malformed-inventory');

    const entries = new Map();
    for (const entry of manifest.inventory) {
      if (!ordinaryObject(entry) || typeof entry.path !== 'string' || typeof entry.sha256 !== 'string' || !Number.isSafeInteger(entry.size) || entry.size < 0 || typeof entry.surface !== 'string') stop('REJECT malformed-inventory-entry');
      if (isAbsolute(entry.path) || !/^fixtures\/[A-Za-z0-9._-]+$/.test(entry.path) || entry.path.includes('\\') || entry.path.split('/').includes('..') || posix.normalize(entry.path) !== entry.path) stop(`REJECT unsafe-path ${entry.path}`);
      if (!/^[a-f0-9]{64}$/.test(entry.sha256)) stop(`REJECT malformed-digest ${entry.path}`);
      if (entry.size > trusted.maxFileBytes) stop(`REJECT resource-cap ${entry.path}`);
      if (entries.has(entry.path)) stop(`REJECT duplicate-inventory-path ${entry.path}`);
      entries.set(entry.path, entry);
    }
    const totalExpected = [...entries.values()].reduce((sum, entry) => sum + entry.size, 0);
    if (totalExpected > trusted.maxTotalBytes) stop('REJECT total-resource-cap');

    const fixturesPath = resolve(root, 'fixtures');
    if (!inside(rootReal, fixturesPath)) stop('REJECT fixture-path-escape');
    const fixturesStat = await lstat(fixturesPath);
    if (fixturesStat.isSymbolicLink() || !fixturesStat.isDirectory()) stop('REJECT unsafe-fixtures-directory');
    const fixturesReal = await realpath(fixturesPath);
    if (!inside(rootReal, fixturesReal)) stop('REJECT fixture-realpath-escape');

    const directoryEntries = (await readdir(fixturesPath, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name));
    if (directoryEntries.length > trusted.maxFiles) stop('REJECT filesystem-file-count-cap');
    const observedPaths = [];
    for (const item of directoryEntries) {
      const candidatePath = `fixtures/${item.name}`;
      if (item.isSymbolicLink() || !item.isFile()) stop(`REJECT artifact-entry-not-regular ${candidatePath}`);
      if (!entries.has(candidatePath)) stop(`REJECT unlisted-artifact ${candidatePath}`);
      observedPaths.push(candidatePath);
    }
    for (const inventoryPath of [...entries.keys()].sort()) {
      if (!observedPaths.includes(inventoryPath)) stop(`REJECT missing-artifact ${inventoryPath}`);
    }
    console.log(`INVENTORY PASS files=${observedPaths.length}`);

    const verified = [];
    let observedTotal = 0;
    for (const inventoryPath of [...entries.keys()].sort()) {
      const entry = entries.get(inventoryPath);
      const filePath = resolve(root, inventoryPath);
      if (!inside(rootReal, filePath)) stop(`REJECT path-escape ${inventoryPath}`);
      const fileStat = await lstat(filePath);
      if (fileStat.isSymbolicLink() || !fileStat.isFile()) stop(`REJECT artifact-not-regular ${inventoryPath}`);
      const fileReal = await realpath(filePath);
      if (!inside(fixturesReal, fileReal)) stop(`REJECT realpath-escape ${inventoryPath}`);
      if (fileStat.size !== entry.size) stop(`REJECT size-mismatch ${inventoryPath} expected=${entry.size} observed=${fileStat.size}`);
      observedTotal += fileStat.size;
      if (observedTotal > trusted.maxTotalBytes) stop('REJECT total-resource-cap');
      const bytes = await readFile(filePath);
      const digest = hex(await webcrypto.subtle.digest('SHA-256', bytes));
      if (digest !== entry.sha256) stop(`DIGEST REJECT ${inventoryPath} expected=${entry.sha256} observed=${digest}`, 'PROMOTION REJECT digest-mismatch');
      console.log(`DIGEST PASS ${inventoryPath} ${digest}`);
      verified.push(`${inventoryPath}=${digest}`);
    }

    const inventoryPaths = [...entries.keys()].sort();
    if (!Array.isArray(manifest.sbom?.components) || manifest.sbom.components.some(value => typeof value !== 'string')) stop('REJECT malformed-sbom');
    const sbomPaths = [...manifest.sbom.components].sort();
    if (new Set(sbomPaths).size !== sbomPaths.length || JSON.stringify(sbomPaths) !== JSON.stringify(inventoryPaths)) stop('REJECT sbom-inventory-mismatch');
    console.log('SBOM PASS inventory-covered');

    if (!inventoryPaths.every(path => ['inert-bytes', 'static-text'].includes(entries.get(path).surface)) || manifest.executableSurfaces?.status !== 'reviewed' || manifest.executableSurfaces?.serialization !== 'none' || manifest.executableSurfaces?.customCode !== false || manifest.executableSurfaces?.nativeExtensions !== false || manifest.executableSurfaces?.loadAttempted !== false) stop('REJECT unsafe-executable-surface');
    console.log('EXECUTABLE-SURFACE PASS no-load');

    if (manifest.policy.signatureRequired !== false || manifest.signature?.status !== 'not-applicable' || typeof manifest.signature?.reason !== 'string') stop('REJECT signature-policy');
    console.log('SIGNATURE NOT-APPLICABLE local-fixture-policy');
    if (manifest.provenance?.builder !== trusted.builder || manifest.provenance?.sourceRevision !== trusted.sourceRevision || manifest.provenance?.predicate !== 'local deterministic fixture') stop('REJECT provenance-policy');
    console.log('PROVENANCE PASS expected-local-builder');
    if (manifest.scan?.status !== 'clean-within-fixture-rules' || typeof manifest.scan?.scope !== 'string' || manifest.scan.scope.length < 1) stop('REJECT malformed-scan-evidence');
    console.log('SCAN PASS stated-fixture-scope');

    const observedBinding = verified.join('|');
    if (!ordinaryObject(manifest.promotion) || typeof manifest.promotion.inventoryBinding !== 'string' || manifest.promotion.servingEnabled !== false || typeof manifest.promotion.evaluationTarget !== 'string') stop('REJECT malformed-promotion-evidence');
    const expectedBinding = selectExpectedBinding(manifest);
    if (observedBinding !== expectedBinding) stop(`PROMOTION REJECT inventory-binding-mismatch expected=${expectedBinding} observed=${observedBinding}`);
    console.log(`PROMOTION PASS bundle=${manifest.bundleId}`);
    return 0;
  } catch (error) {
    if (!(error instanceof ControlledReject)) console.log(`REJECT ${error.code || error.message}`);
    return 1;
  }
}
