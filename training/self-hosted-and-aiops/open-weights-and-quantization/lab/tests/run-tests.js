import { readFile } from "node:fs/promises";
import { analyzeManifest, analyzeVariant, validateManifest, validateVariant } from "../src/analyze.js";

const base = JSON.parse(await readFile(new URL("../fixtures/variants.json", import.meta.url), "utf8"));
const changed = JSON.parse(await readFile(new URL("../fixtures/changed.json", import.meta.url), "utf8"));

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

deepFreeze(base);
deepFreeze(changed);

function clone(value) {
  return structuredClone(value);
}

function equal(actual, expected) {
  if (!Object.is(actual, expected)) throw new Error(`expected ${String(expected)}, received ${String(actual)}`);
}

function throws(action) {
  let didThrow = false;
  try { action(); } catch { didThrow = true; }
  if (!didThrow) throw new Error("expected an exception");
}

const tests = [
  ["rejects a non-array manifest", () => throws(() => validateManifest({}))],
  ["rejects a non-object variant", () => throws(() => validateVariant([]))],
  ["validates integer parameter counts", () => {
    const value = clone(base[0]); value.parameters = 1.5; throws(() => validateVariant(value));
  }],
  ["validates finite positive measured bpw", () => {
    const value = clone(base[0]); value.measuredBpw = Number.POSITIVE_INFINITY; throws(() => validateVariant(value));
  }],
  ["validates units", () => {
    const value = clone(base[0]); value.memoryBudgetUnit = "GB"; throws(() => validateVariant(value));
  }],
  ["validates format enum", () => {
    const value = clone(base[0]); value.format = "mystery"; throws(() => validateVariant(value));
  }],
  ["validates runtime enum", () => {
    const value = clone(base[0]); value.runtime.mode = "maybe"; throws(() => validateVariant(value));
  }],
  ["computes worked payload and overhead", () => {
    const report = analyzeVariant(base[0]); equal(report.predictedPayloadBytes, 8500000000); equal(report.overheadBytes, 85000000); equal(report.discrepancyPercent, 1);
  }],
  ["computes packed resident weights", () => equal(analyzeVariant(base[0]).residentWeightBytes, 8500000000)],
  ["computes dequantized resident weights", () => equal(analyzeVariant(base[1]).residentWeightBytes, 16000000000)],
  ["leaves unsupported runtime resident memory UNKNOWN", () => equal(analyzeVariant(base[2]).residentWeightBytes, null)],
  ["accepts the changed input without identifier-specific logic", () => {
    const [report] = analyzeManifest(changed); equal(report.predictedPayloadBytes, 4900000000); equal(report.residentWeightBytes, 4900000000); equal(report.status, "READY");
  }]
];

const failures = [];
for (const [name, test] of tests) {
  try {
    test();
    console.log(`PASS ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push({name, message});
    console.log(`FAIL ${name}: ${message}`);
  }
}

if (failures.length === 0) {
  console.log(`All ${tests.length} tests passed.`);
  process.exitCode = 0;
} else {
  console.log(`${failures.length} test(s) failed of ${tests.length}.`);
  process.exitCode = 1;
}
