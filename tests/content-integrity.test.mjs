import assert from 'node:assert/strict';
import test from 'node:test';
import { resolve } from 'node:path';
import { validateContentRepository } from '../scripts/validate-content.mjs';

const root = resolve(import.meta.dirname, '..');

test('validates full content repository integrity and cardinality', async () => {
  const result = await validateContentRepository(root);
  assert.ok(result.pathsCount >= 8, `Expected at least 8 paths, found ${result.pathsCount}`);
  assert.ok(result.modulesCount >= 70, `Expected at least 70 modules, found ${result.modulesCount}`);
  assert.ok(result.diagramsCount >= 10, `Expected at least 10 diagrams, found ${result.diagramsCount}`);
});
