import fs from 'node:fs';
import { buildContext } from './engine.js';

const fileFlag = process.argv.indexOf('--file');
const path = fileFlag >= 0 ? process.argv[fileFlag + 1] : new URL('../fixtures/scenarios.json', import.meta.url);
const parsed = JSON.parse(fs.readFileSync(path, 'utf8'));
const cases = Array.isArray(parsed.cases) ? parsed.cases : [parsed];

for (const item of cases) {
  try {
    const result = buildContext(item);
    const selected = result.selected.length ? result.selected.join(',') : '-';
    const untrusted = result.untrusted.length ? result.untrusted.join(',') : '-';
    const missing = result.missing.length ? result.missing.join(',') : '-';
    const conflicts = result.conflicts.length ? result.conflicts.join(',') : '-';
    console.log(`${result.caseId} ${result.status} selected=${selected} untrusted=${untrusted} missing=${missing} conflicts=${conflicts} budget=${result.reservations.used}/${result.reservations.evidenceCapacity}`);
  } catch (error) {
    console.log(`${item.caseId ?? 'unknown'} INVALID ${error.message}`);
    process.exitCode = 1;
  }
}
