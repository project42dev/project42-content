import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MemoryService, BoundaryError } from "../src/memory.js";

const policy = JSON.parse(readFileSync(new URL("../fixtures/policy.json", import.meta.url)));
const ctx = { tenantId: "tenant-a", subjectId: "subject-1", purpose: "notification-preference" };
const initial = {
  value: "Send a weekly synthetic digest.",
  source: "user-confirmed",
  verifiedAt: "2026-09-20T12:00:00.000Z",
  sensitivity: "restricted",
  expiresAt: "2026-10-01T12:00:00.000Z"
};
const corrected = { ...initial, value: "Send a monthly synthetic digest." };

function isDenied(error) {
  return error instanceof BoundaryError && error.code === "DENIED";
}

test("changed-input lifecycle solution", () => {
  const service = new MemoryService({ policy, now: "2026-09-20T12:00:00.000Z" });
  const first = service.write(initial, ctx, "exercise-write");
  assert.equal(service.read(ctx)[0].kind, "evidence");

  const otherSubject = { ...ctx, subjectId: "subject-other" };
  assert.throws(() => service.read(otherSubject), isDenied);

  service.setConsent(ctx, false);
  assert.throws(() => service.read(ctx, { layer: "cache" }), isDenied);

  service.setConsent(ctx, true);
  const second = service.correct(first.id, corrected, ctx, "exercise-correct");
  assert.notEqual(second.id, first.id);
  assert.deepEqual(service.read(ctx).map(item => item.id), [second.id]);

  const pending = service.requestDeletion(second.id, ctx, "exercise-delete");
  assert.equal(pending.status, "pending-backup");
  const falseClaim = service.reconcileDeletion(second.id, ctx, { backup: false, completed: true });
  assert.equal(falseClaim.status, "pending-backup");
  assert.deepEqual(service.read(ctx, { layer: "backup" }), []);

  const serialized = JSON.stringify(falseClaim);
  assert.equal(serialized.includes(initial.value), false);
  assert.equal(serialized.includes(corrected.value), false);
  assert.equal(falseClaim.provenance.source, "user-confirmed");

  service.setNow("2026-09-24T12:00:00.000Z");
  const completed = service.reconcileDeletion(second.id, ctx);
  assert.equal(completed.status, "completed");
  assert.equal(Object.values(completed.copyStates).some(Boolean), false);
});
