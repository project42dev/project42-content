import { readFile } from "node:fs/promises";
import { MemoryService } from "./memory.js";

const policy = JSON.parse(await readFile(new URL("../fixtures/policy.json", import.meta.url), "utf8"));
const proposals = JSON.parse(await readFile(new URL("../fixtures/proposals.json", import.meta.url), "utf8"));

function print(label, value) {
  console.log(`${label} ${JSON.stringify(value)}`);
}

if (process.argv[2] !== "demo") {
  console.error("usage: node src/cli.js demo");
  process.exitCode = 2;
} else {
  const service = new MemoryService({ policy, now: "2026-09-20T12:00:00.000Z" });
  const ctx = { tenantId: "tenant-a", subjectId: "subject-1", purpose: "writing-style" };
  const created = service.write(service.propose(proposals.safeStyle), ctx, "req-write-1");
  print("WRITE", created);
  print("READ", service.read(ctx, { layer: "cache" }));
  const corrected = service.correct(created.id, proposals.correctedStyle, ctx, "req-correct-1");
  print("CORRECT", corrected);
  print("CURRENT", service.read(ctx, { layer: "index" }));
  const pending = service.requestDeletion(corrected.id, ctx, "req-delete-1");
  print("DELETE", pending);
  print("LOOKUP", service.read(ctx, { layer: "backup" }));
  print("RECONCILE_EARLY", service.reconcileDeletion(corrected.id, ctx, { backup: false }));
  service.setNow("2026-09-24T12:00:00.000Z");
  print("RECONCILE_FINAL", service.reconcileDeletion(corrected.id, ctx, { backup: true }));
}
