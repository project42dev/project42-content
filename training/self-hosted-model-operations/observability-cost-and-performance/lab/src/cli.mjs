import { readFile } from 'node:fs/promises';
import { aggregateP95 } from './aggregate.mjs';
async function main(){if(process.argv.length!==3)throw new Error('usage: node src/cli.mjs <fixture.json>');const input=JSON.parse(await readFile(process.argv[2],'utf8'));const result=aggregateP95(input);process.stdout.write(`p95_ms=${result.p95Ms.toFixed(2)} requests=${result.requests} replicas=${result.replicas} release=${result.releaseId}\n`)}
main().catch(error=>{process.stderr.write(`ERROR ${error.message}\n`);process.exitCode=2});
