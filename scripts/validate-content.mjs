import { readdir, readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

export async function validateContentRepository(root = process.cwd()) {
  const catalogPath = resolve(root, 'catalog.json');
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));

  if (!catalog.paths || !Array.isArray(catalog.paths)) {
    throw new Error('catalog.json is missing required paths array');
  }

  const moduleFiles = await findJsonFiles(resolve(root, 'modules'));
  const modules = await Promise.all(
    moduleFiles.map(async (file) => {
      const parsed = JSON.parse(await readFile(file, 'utf8'));
      if (!parsed.id || !parsed.title || !parsed.level) {
        throw new Error(`Module ${file} is missing required fields (id, title, level)`);
      }
      return parsed;
    })
  );

  const diagramCatalogPath = resolve(root, 'diagrams/catalogue.json');
  const diagramCatalog = JSON.parse(await readFile(diagramCatalogPath, 'utf8'));
  if (!diagramCatalog.diagrams || !Array.isArray(diagramCatalog.diagrams)) {
    throw new Error('diagrams/catalogue.json is missing required diagrams array');
  }

  return {
    pathsCount: catalog.paths.length,
    modulesCount: modules.length + (catalog.modules?.length ?? 0),
    diagramsCount: diagramCatalog.diagrams.length,
  };
}

async function findJsonFiles(dir) {
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
      paths.push(...(await findJsonFiles(full)));
    } else if (entry.isFile() && extname(entry.name) === '.json') {
      paths.push(full);
    }
  }
  return paths.sort();
}

if (process.argv[1] && process.argv[1].endsWith('validate-content.mjs')) {
  const summary = await validateContentRepository();
  console.log(`Validation passed: ${summary.pathsCount} paths, ${summary.modulesCount} modules, ${summary.diagramsCount} diagrams.`);
}
