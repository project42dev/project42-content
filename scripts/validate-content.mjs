import { readdir, readFile } from 'node:fs/promises';
import { extname, resolve, relative, sep } from 'node:path';

// The contract this repository has to meet, checked here rather than three
// repositories downstream.
//
// Until now this file counted files. It read every module, asserted id/title/
// level were present, and returned a tally. Everything else -- whether a
// declared instructor script had any narration in it, whether a rendering
// matched the script it claims to be a rendering of -- was checked only after
// the curriculum had been synced into project42-platform and run through
// src/schema.ts. So the curriculum grew for two weeks with 22 modules
// declaring an instructor-led rendering that had never been written, and
// nothing here objected. That is what this file now prevents.
//
// ADR-0020: instructor-led delivery is a *rendering of the same module*, not a
// second catalogue. So the declaration and the completeness rules live beside
// the module, in this repository, and every consumer inherits them.

const REQUIRED_CUE_KINDS = [
  'narration',
  'visual',
  'learner-prompt',
  'checkpoint',
  'assessment-handoff',
];

const CLASS_SCRIPT_FILENAME = 'class-script.json';
const RENDERING_FILENAME = 'instructor-rendering.json';

export async function validateContentRepository(root = process.cwd()) {
  const errors = [];
  const catalogPath = resolve(root, 'catalog.json');
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));

  if (!catalog.paths || !Array.isArray(catalog.paths)) {
    throw new Error('catalog.json is missing required paths array');
  }

  const moduleFiles = await findJsonFiles(resolve(root, 'modules'));
  const fileModules = await Promise.all(
    moduleFiles.map(async (file) => {
      const parsed = JSON.parse(await readFile(file, 'utf8'));
      if (!parsed.id || !parsed.title || !parsed.level) {
        throw new Error(`Module ${file} is missing required fields (id, title, level)`);
      }
      return { module: parsed, where: relative(root, file).split(sep).join('/') };
    })
  );

  const allModules = [
    ...fileModules,
    ...(catalog.modules ?? []).map((module) => ({ module, where: 'catalog.json' })),
  ];

  // Every module declares, explicitly, whether it has an instructor rendering.
  // The declaration is the presence of instructorScript: a module carrying one
  // is claiming it can be taught, and a module without one is honestly
  // outline-only. What the declaration may not be is an empty shell.
  const declared = [];
  for (const { module, where } of allModules) {
    if (!module.instructorScript) continue;
    declared.push(module);
    validateInstructorScript(module, where, errors);
  }

  const renderings = await validateInstructorRenderings(root, allModules, errors);

  const diagramCatalogPath = resolve(root, 'diagrams/catalogue.json');
  const diagramCatalog = JSON.parse(await readFile(diagramCatalogPath, 'utf8'));
  if (!diagramCatalog.diagrams || !Array.isArray(diagramCatalog.diagrams)) {
    throw new Error('diagrams/catalogue.json is missing required diagrams array');
  }

  if (errors.length > 0) {
    throw new Error(
      `Content validation failed with ${errors.length} error(s):\n  - ${errors.join('\n  - ')}`
    );
  }

  return {
    pathsCount: catalog.paths.length,
    modulesCount: fileModules.length + (catalog.modules?.length ?? 0),
    diagramsCount: diagramCatalog.diagrams.length,
    instructorScriptCount: declared.length,
    instructorRenderingCount: renderings.length,
  };
}

// Mirrors validateInstructorScript in project42-platform src/schema.ts. The
// platform rejects an incomplete script anyway; the point of checking here is
// that the failure lands on the commit that wrote it, in the repository that
// owns it, instead of on whoever next syncs the curriculum.
function validateInstructorScript(module, where, errors) {
  const script = module.instructorScript;
  const at = `${module.id} (${where})`;

  if (script.schemaVersion !== '1.0' && script.schemaVersion !== '1.1') {
    errors.push(`${at}: unsupported instructor script version ${script.schemaVersion}`);
  }
  if (!Number.isInteger(script.estimatedSeconds) || script.estimatedSeconds <= 0) {
    errors.push(`${at}: instructor script needs a positive estimatedSeconds`);
  }
  if (!Array.isArray(script.cues) || script.cues.length === 0) {
    errors.push(
      `${at}: declares an instructor script with no cues. Remove the declaration, ` +
        'or author the narration -- an empty script claims the module is ready to teach.'
    );
    return;
  }

  const sectionIds = new Set((module.sections ?? []).map((section) => section.id));
  const cueKinds = new Set();
  const cueIds = new Set();
  for (const cue of script.cues) {
    if (!cue.id) errors.push(`${at}: an instructor cue has no id`);
    if (cueIds.has(cue.id)) errors.push(`${at}: duplicate instructor cue id ${cue.id}`);
    cueIds.add(cue.id);
    cueKinds.add(cue.kind);
    if (!cue.text || !cue.text.trim()) {
      errors.push(`${at}: instructor cue ${cue.id} has no text`);
    }
    if (cue.sectionId && !sectionIds.has(cue.sectionId)) {
      errors.push(`${at}: instructor cue ${cue.id} references missing section ${cue.sectionId}`);
    }
    if (cue.kind === 'visual' && !cue.accessibilityAlternative?.trim()) {
      errors.push(`${at}: visual instructor cue ${cue.id} needs an accessibility alternative`);
    }
  }

  for (const section of module.sections ?? []) {
    const hasNarration = script.cues.some(
      (cue) => cue.sectionId === section.id && cue.kind === 'narration'
    );
    if (!hasNarration) {
      errors.push(`${at}: section ${section.id} has no instructor narration cue`);
    }
  }
  for (const kind of REQUIRED_CUE_KINDS) {
    if (!cueKinds.has(kind)) {
      errors.push(`${at}: instructor script has no ${kind} cue`);
    }
  }
  if (script.schemaVersion === '1.1') {
    if (!script.transcript?.trim()) {
      errors.push(`${at}: instructor script 1.1 needs a transcript`);
    }
    if (!script.reducedMotionAlternative?.trim()) {
      errors.push(`${at}: instructor script 1.1 needs a reduced-motion alternative`);
    }
  }
}

// A filmed rendering of a module. Held here rather than in a deployment's front
// end because ADR-0020 makes instructor-led a rendering of the same content
// item, so which lessons exist is a fact about the curriculum, not about one
// site. The video itself is not in this repository: it is tens of megabytes of
// derived binary, and a hash-locked text curriculum that every consumer clones
// is the wrong place for it. The manifest carries a media key and the consumer
// resolves it against wherever it serves media from.
async function validateInstructorRenderings(root, allModules, errors) {
  const trainingRoot = resolve(root, 'training');
  const modulesById = new Map(allModules.map(({ module }) => [module.id, module]));
  const renderingFiles = await findNamedFiles(trainingRoot, RENDERING_FILENAME);
  const renderings = [];
  const seen = new Set();

  for (const file of renderingFiles) {
    const relativePath = relative(trainingRoot, file).split(sep).join('/');
    const parts = relativePath.split('/');
    if (parts.length !== 3) {
      errors.push(
        `Instructor renderings must live at training/<path>/<module>/${RENDERING_FILENAME}: ${relativePath}`
      );
      continue;
    }
    const [pathId, moduleDir] = parts;
    const manifest = JSON.parse(await readFile(file, 'utf8'));
    const at = `instructor rendering ${relativePath}`;

    if (manifest.schemaVersion !== '1.0') {
      errors.push(`${at}: unsupported schemaVersion ${manifest.schemaVersion}`);
    }
    if (manifest.moduleId !== moduleDir) {
      errors.push(`${at}: declares module ${manifest.moduleId} but sits under ${moduleDir}`);
    }
    if (seen.has(manifest.moduleId)) {
      errors.push(`${at}: a second rendering for module ${manifest.moduleId}`);
    }
    seen.add(manifest.moduleId);

    const module = modulesById.get(manifest.moduleId);
    if (!module) {
      errors.push(`${at}: references a module that does not exist`);
    } else if (!module.instructorScript) {
      errors.push(
        `${at}: the module does not declare an instructor script, so there is nothing this ` +
          'rendering can be a rendering of'
      );
    }

    // The class-script package it was filmed from has to be here, and the
    // manifest may not claim more segments than the script contains.
    const scriptPath = resolve(trainingRoot, pathId, moduleDir, CLASS_SCRIPT_FILENAME);
    let script;
    try {
      script = JSON.parse(await readFile(scriptPath, 'utf8'));
    } catch {
      errors.push(`${at}: no ${CLASS_SCRIPT_FILENAME} beside it to have been rendered from`);
    }
    if (script) {
      if (manifest.classScriptId !== script.id) {
        errors.push(`${at}: classScriptId ${manifest.classScriptId} is not ${script.id}`);
      }
      if (manifest.classScriptVersion !== script.version) {
        errors.push(
          `${at}: filmed from class-script version ${manifest.classScriptVersion}, ` +
            `which is not the committed ${script.version}`
        );
      }
      const segmentCount = (script.segments ?? []).length;
      if (
        !Number.isInteger(manifest.renderedSegments) ||
        manifest.renderedSegments < 1 ||
        manifest.renderedSegments > segmentCount
      ) {
        errors.push(
          `${at}: renderedSegments ${manifest.renderedSegments} is outside the ` +
            `${segmentCount} segments the class script has`
        );
      }
    }

    if (!Number.isInteger(manifest.renderedSeconds) || manifest.renderedSeconds <= 0) {
      errors.push(`${at}: renderedSeconds must be a positive integer`);
    }
    if (manifest.releaseStatus !== 'preview' && manifest.releaseStatus !== 'released') {
      errors.push(`${at}: releaseStatus must be "preview" or "released"`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(manifest.renderedAt ?? '')) {
      errors.push(`${at}: renderedAt must be an ISO date`);
    }
    for (const field of ['adapter', 'avatar', 'voice', 'disclosure']) {
      if (!manifest.production?.[field]?.trim()) {
        errors.push(`${at}: production.${field} is required`);
      }
    }
    // A learner has to be told the instructor is synthetic. That is why the
    // disclosure is part of the contract rather than one site's page copy.
    if (!/synthetic|generated|virtual/i.test(manifest.production?.disclosure ?? '')) {
      errors.push(`${at}: production.disclosure must say the instructor is synthetic`);
    }
    const key = manifest.media?.key ?? '';
    if (!key || key.includes('/') || key.includes('\\') || key.startsWith('.')) {
      errors.push(`${at}: media.key must be a bare filename, not a path or a URL`);
    }
    for (const field of ['mediaType', 'captions', 'locale']) {
      if (!manifest.media?.[field]?.trim()) {
        errors.push(`${at}: media.${field} is required`);
      }
    }

    renderings.push(manifest);
  }
  return renderings;
}

async function findJsonFiles(dir) {
  return findMatching(dir, (name) => extname(name) === '.json');
}

async function findNamedFiles(dir, filename) {
  return findMatching(dir, (name) => name === filename);
}

async function findMatching(dir, accept) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
  const paths = [];
  for (const entry of entries) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      paths.push(...(await findMatching(full, accept)));
    } else if (entry.isFile() && accept(entry.name)) {
      paths.push(full);
    }
  }
  return paths.sort();
}

if (process.argv[1] && process.argv[1].endsWith('validate-content.mjs')) {
  const summary = await validateContentRepository();
  console.log(
    `Validation passed: ${summary.pathsCount} paths, ${summary.modulesCount} modules, ` +
      `${summary.diagramsCount} diagrams, ${summary.instructorScriptCount} instructor scripts, ` +
      `${summary.instructorRenderingCount} instructor rendering(s).`
  );
}
