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

test("changed-input lifecycle", () => {
  const service = new MemoryService({ policy, now: "2026-09-20T12:00:00.000Z" });

  // TODO: implement the nine requirements in exercise/README.md.
  // Use assert.throws with BoundaryError for revoked or unknown authorization.
  // Derive every record ID from write or correct results.
  assert.ok(service);
});
