import { isDeepStrictEqual } from 'node:util';

export function verifyRollbackReadback(packet) {
  return packet.rehearsal.readback.ready === true &&
    isDeepStrictEqual(packet.rehearsal.readback.manifest, packet.manifests.baseline);
}
