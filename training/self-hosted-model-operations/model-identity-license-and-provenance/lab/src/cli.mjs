import { readFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDossier } from './validate.mjs';
import { assessEvidence } from './assess.mjs';

const labRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function main() {
  if (process.argv.length !== 5 || process.argv[3] !== '--as-of') throw new Error('usage: node src/cli.mjs fixtures/<name>.json --as-of YYYY-MM-DD');
  const fixturePath = resolve(process.cwd(), process.argv[2]);
  const dossier = validateDossier(JSON.parse(await readFile(fixturePath, 'utf8')));
  const implementation = process.env.P42_DECIDER === 'reference' ? '../solution/reference.mjs' : './evaluate.mjs';
  const { decide } = await import(implementation);
  const assessment = await assessEvidence(dossier, labRoot, process.argv[4]);
  const decision = decide(dossier, assessment);
  const output = { fixture: basename(fixturePath), asOf: process.argv[4], completeness: assessment.completeness, disposition: decision.disposition, reasons: decision.reasons };
  process.stdout.write(`${JSON.stringify(output)}\n`);
}

main().catch(error => { process.stderr.write(`ERROR ${error instanceof Error ? error.message : String(error)}\n`); process.exitCode = 2; });
