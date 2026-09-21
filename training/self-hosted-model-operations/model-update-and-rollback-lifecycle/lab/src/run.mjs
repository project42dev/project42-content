import { readFile } from 'node:fs/promises';
import { decidePromotion } from './decision.mjs';
import { validatePacket } from './validate.mjs';

const input = process.argv[2];
if (!input) {
  console.error('Usage: node src/run.mjs <packet.json>');
  process.exitCode = 64;
} else {
  try {
    const packet = validatePacket(JSON.parse(await readFile(input, 'utf8')));
    const result = decidePromotion(packet);
    console.log(`DECISION: ${result.decision.toUpperCase()}`);
    console.log(`ROLLBACK_COMPATIBLE: ${result.rollbackCompatible}`);
    console.log(`FAILED_GATES: ${result.failedGates.length ? result.failedGates.join(',') : 'none'}`);
    process.exitCode = result.decision === 'promote' ? 0 : 2;
  } catch (error) {
    console.error(`INVALID_PACKET: ${error.message}`);
    process.exitCode = 3;
  }
}
