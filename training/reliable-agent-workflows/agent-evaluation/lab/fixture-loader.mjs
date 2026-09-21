import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { assertValidFixtureDocument, EvidenceValidationError } from './schema-validation.mjs';

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

export async function loadFixture(path) {
  const requested = resolve(path);
  const document = await readJson(requested);
  let result = document;

  if (document.base) {
    const base = await readJson(resolve(dirname(requested), document.base));
    if (!Array.isArray(document.overrides)) {
      throw new EvidenceValidationError('recovery overrides must be an array');
    }
    const overrides = new Map();
    for (const entry of document.overrides) {
      if (!entry || typeof entry.id !== 'string') {
        throw new EvidenceValidationError('every recovery override must have an ID');
      }
      if (overrides.has(entry.id)) {
        throw new EvidenceValidationError(`duplicate recovery override ${entry.id}`);
      }
      overrides.set(entry.id, entry);
    }
    for (const id of overrides.keys()) {
      if (!base.cases.some((testCase) => testCase.id === id)) {
        throw new EvidenceValidationError(`unknown recovery override ${id}`);
      }
    }
    result = {
      ...base,
      manifest: {...base.manifest, fixtureVersion: `${base.manifest.fixtureVersion}+recovery`},
      cases: base.cases.map((testCase) => {
        const override = overrides.get(testCase.id);
        if (!override) return testCase;
        return {
          ...testCase,
          ...override,
          candidate: {...testCase.candidate, ...override.candidate}
        };
      })
    };
  }

  assertValidFixtureDocument(result);
  return result;
}
