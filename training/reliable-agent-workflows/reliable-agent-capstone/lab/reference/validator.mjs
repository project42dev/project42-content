import { validatePackageCore } from '../shared/package-validation.mjs';

export async function validatePackage(dir) {
  return validatePackageCore(dir, { validateBinding });
}

async function validateBinding({ dir, ref, evaluation, manifest, readFile, join, bindingKeys }) {
  const binding = ref === 'evaluation-set-and-rubric.json'
    ? evaluation.binding
    : parseBinding(await readFile(join(dir, ref), 'utf8'));
  if (!binding) return { code: 'E_BINDING', detail: `${ref}:missing` };
  for (const key of bindingKeys) {
    if (binding[key] !== manifest[key]) return { code: 'E_BINDING', detail: `${ref}:${key}` };
  }
  return null;
}

function parseBinding(text) {
  const first = text.split(/\r?\n/, 1)[0];
  if (!first.startsWith('Evidence-Binding: ')) return null;
  try {
    const value = JSON.parse(first.slice('Evidence-Binding: '.length));
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}
