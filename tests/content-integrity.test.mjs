import assert from 'node:assert/strict';
import test from 'node:test';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { validateContentRepository } from '../scripts/validate-content.mjs';

const root = resolve(import.meta.dirname, '..');

test('validates full content repository integrity and cardinality', async () => {
  const result = await validateContentRepository(root);
  assert.ok(result.pathsCount >= 8, `Expected at least 8 paths, found ${result.pathsCount}`);
  assert.ok(result.modulesCount >= 70, `Expected at least 70 modules, found ${result.modulesCount}`);
  assert.ok(result.diagramsCount >= 10, `Expected at least 10 diagrams, found ${result.diagramsCount}`);
  assert.ok(
    result.instructorScriptCount > 0,
    'Expected at least one module to declare an instructor script'
  );
});

// The regression this repository actually shipped: 22 modules declared an
// instructor-led rendering whose narration had never been written. Nothing in
// this repository objected, and the false claim only surfaced when the platform
// started consuming the curriculum. These tests plant the same shape back and
// require it to fail here, in the repository that owns the material.
async function withPlantedCopy(mutate, assertion) {
  const workspace = await mkdtemp(join(tmpdir(), 'p42-content-plant-'));
  try {
    for (const entry of ['catalog.json', 'modules', 'diagrams', 'training']) {
      await cp(join(root, entry), join(workspace, entry), { recursive: true });
    }
    const modulePath = join(
      workspace,
      'modules/ai-foundations/agents-and-guardrails.json'
    );
    const module = JSON.parse(await readFile(modulePath, 'utf8'));
    mutate(module);
    await writeFile(modulePath, JSON.stringify(module, null, 2));

    await assert.rejects(
      () => validateContentRepository(workspace),
      (error) => {
        assertion(error.message);
        return true;
      }
    );
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
}

test('rejects a declared instructor script with no cues', async () => {
  await withPlantedCopy(
    (module) => {
      module.instructorScript = {
        schemaVersion: '1.0',
        estimatedSeconds: 2700,
        cues: [],
      };
    },
    (message) => {
      assert.match(message, /agents-and-guardrails/);
      assert.match(message, /declares an instructor script with no cues/);
    }
  );
});

test('rejects a declared instructor script that is only a welcome line', async () => {
  // Exactly what the 22 stripped modules carried: a single boilerplate
  // narration cue and none of the visual, learner-prompt, checkpoint or
  // assessment-handoff cues the rendering needs to be teachable.
  await withPlantedCopy(
    (module) => {
      module.instructorScript = {
        schemaVersion: '1.0',
        estimatedSeconds: 2700,
        cues: [
          {
            id: 'planted-cue-1',
            kind: 'narration',
            text: 'Welcome to this module.',
          },
        ],
      };
    },
    (message) => {
      for (const kind of ['visual', 'learner-prompt', 'checkpoint', 'assessment-handoff']) {
        assert.match(message, new RegExp(`instructor script has no ${kind} cue`));
      }
      assert.match(message, /has no instructor narration cue/);
    }
  );
});

test('rejects a rendering of a module that declares no instructor script', async () => {
  // A rendering is a rendering *of* something. Filming a module that never
  // declared an instructor-led delivery would publish a lesson with no script
  // behind it and no way to re-render it when the module changes.
  await withPlantedCopy(
    (module) => {
      delete module.instructorScript;
    },
    (message) => {
      assert.match(message, /does not declare an instructor script/);
    }
  );
});
