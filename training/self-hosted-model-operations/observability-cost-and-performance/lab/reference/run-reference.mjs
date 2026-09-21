import { readFile } from 'node:fs/promises';
import { referenceAggregate } from './private-reference.mjs';
const input=JSON.parse(await readFile(process.argv[2],'utf8'));const result=referenceAggregate(input);process.stdout.write(`p95_ms=${result.p95Ms.toFixed(2)} requests=${result.requests} replicas=${result.replicas} release=${result.releaseId}\n`);
