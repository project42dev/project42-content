import { readFile } from 'node:fs/promises';
import { validatePacket } from './validate.mjs';
import { verifyRollbackReadback } from './recovery.mjs';

const input = process.argv[2];
if (!input) {
  console.error('Usage: node src/rehearse.mjs <packet.json>');
  process.exitCode = 64;
} else {
  try {
    const packet = validatePacket(JSON.parse(await readFile(input, 'utf8')));
    const { rollout, rehearsal, manifests } = packet;
    const failed = rehearsal.guardrail.observed > rehearsal.guardrail.maximum;
    const manifestMatches = verifyRollbackReadback(packet);
    const readback = rehearsal.readback.manifest;
    console.log('SIMULATION_ONLY: true');
    console.log(`EXPOSURE_PERCENT: ${rollout.exposurePercent}`);
    console.log(`OBSERVATION_MINUTES: ${rollout.observationMinutes}`);
    console.log(`GUARDRAIL: ${rehearsal.guardrail.name} observed=${rehearsal.guardrail.observed} maximum=${rehearsal.guardrail.maximum} result=${failed ? 'FAIL' : 'PASS'}`);
    console.log(`ACTION: ${failed ? 'STOP_AND_DRAIN' : 'CONTINUE'}`);
    console.log(`DRAIN_TIMEOUT_SECONDS: ${rollout.drainTimeoutSeconds}`);
    console.log(`ROLLBACK_TARGET: ${manifests.baseline.releaseId}`);
    console.log(`READBACK_RELEASE: ${readback.releaseId}`);
    console.log(`READBACK_MODEL_DIGEST: ${readback.model.digest}`);
    console.log(`READBACK_IMAGE_DIGEST: ${readback.image.digest}`);
    console.log(`READBACK_STATE_SCHEMA: ${readback.stateSchema}`);
    console.log(`READBACK_TELEMETRY_SCHEMA: ${readback.telemetrySchema}`);
    console.log(`READBACK_READY: ${rehearsal.readback.ready}`);
    console.log(`READBACK_COMPLETE_MANIFEST_MATCH: ${manifestMatches}`);
    console.log(`ROLLBACK_VERIFIED: ${failed && manifestMatches}`);
    process.exitCode = failed && manifestMatches ? 0 : 4;
  } catch (error) {
    console.error(`INVALID_PACKET: ${error.message}`);
    process.exitCode = 3;
  }
}
