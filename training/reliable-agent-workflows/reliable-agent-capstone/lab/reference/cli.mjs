import { validatePackage } from './validator.mjs';
const dir = process.argv[2];
if (!dir) { console.log('INVALID E_USAGE package-directory'); process.exitCode = 2; }
else {
  const result = await validatePackage(dir);
  if (result.valid) console.log(`VALID score=${result.score} pass=${result.passed}`);
  else { console.log(`INVALID ${result.code} ${result.detail}`); process.exitCode = 1; }
}
