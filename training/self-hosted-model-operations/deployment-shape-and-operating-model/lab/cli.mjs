import fs from 'node:fs';
import path from 'node:path';
import {select} from './selector.mjs';

function readDecision(argument) {
  if (typeof argument !== 'string' || argument.length === 0) throw new Error('usage: node cli.mjs <fixture.json>');
  const inputPath = path.resolve(process.cwd(), argument);
  return JSON.parse(fs.readFileSync(inputPath, 'utf8'));
}

try {
  const result = select(readDecision(process.argv[2]));
  console.log(JSON.stringify(result));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR ${message}`);
  process.exitCode = 1;
}
