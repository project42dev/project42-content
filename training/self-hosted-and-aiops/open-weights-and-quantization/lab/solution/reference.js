const FORMATS = new Set(["GGUF", "safetensors"]);
const LINEAGES = new Set(["original-high-precision", "requantized", "UNKNOWN"]);
const IMPORTANCE = new Set(["yes", "no", "UNKNOWN"]);
const RUNTIME_MODES = new Set(["packed", "dequantized", "UNKNOWN"]);
const GIB = 1073741824;

function requireObject(value, path) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new TypeError(`${path} must be an object`);
}
function requireString(value, path) {
  if (typeof value !== "string" || value.trim() === "") throw new TypeError(`${path} must be a nonempty string`);
}
function requireInteger(value, path, minimum = 0) {
  if (!Number.isSafeInteger(value) || value < minimum) throw new TypeError(`${path} must be a safe integer >= ${minimum}`);
}
function requireFinitePositive(value, path) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) throw new TypeError(`${path} must be a finite number > 0`);
}
function requireEnum(value, allowed, path) {
  if (!allowed.has(value)) throw new TypeError(`${path} has unsupported value ${String(value)}`);
}

export function validateManifest(manifest) {
  if (!Array.isArray(manifest)) throw new TypeError("manifest must be an array");
  manifest.forEach((variant, index) => validateVariant(variant, `manifest[${index}]`));
  return manifest;
}

export function validateVariant(variant, path = "variant") {
  requireObject(variant, path);
  requireString(variant.id, `${path}.id`);
  if (variant.synthetic !== true) throw new TypeError(`${path}.synthetic must be true`);
  requireString(variant.family, `${path}.family`);
  requireEnum(variant.format, FORMATS, `${path}.format`);
  requireString(variant.quantizationScheme, `${path}.quantizationScheme`);
  requireInteger(variant.parameters, `${path}.parameters`, 1);
  if (variant.parameterUnit !== "weights") throw new TypeError(`${path}.parameterUnit must be weights`);
  requireFinitePositive(variant.measuredBpw, `${path}.measuredBpw`);
  if (variant.bpwUnit !== "bits/weight") throw new TypeError(`${path}.bpwUnit must be bits/weight`);
  requireInteger(variant.actualFileBytes, `${path}.actualFileBytes`, 1);
  if (variant.actualBytesUnit !== "bytes") throw new TypeError(`${path}.actualBytesUnit must be bytes`);
  requireEnum(variant.lineage, LINEAGES, `${path}.lineage`);
  requireEnum(variant.importanceMatrix, IMPORTANCE, `${path}.importanceMatrix`);
  requireObject(variant.runtime, `${path}.runtime`);
  requireString(variant.runtime.name, `${path}.runtime.name`);
  requireEnum(variant.runtime.mode, RUNTIME_MODES, `${path}.runtime.mode`);
  if (variant.runtime.mode === "dequantized") requireInteger(variant.runtime.denseBits, `${path}.runtime.denseBits`, 1);
  else if (variant.runtime.denseBits !== null) throw new TypeError(`${path}.runtime.denseBits must be null unless mode is dequantized`);
  requireInteger(variant.memoryBudgetGiB, `${path}.memoryBudgetGiB`, 1);
  if (variant.memoryBudgetUnit !== "GiB") throw new TypeError(`${path}.memoryBudgetUnit must be GiB`);
  requireObject(variant.quality, `${path}.quality`);
  requireInteger(variant.quality.score, `${path}.quality.score`, 0);
  requireInteger(variant.quality.threshold, `${path}.quality.threshold`, 0);
  requireInteger(variant.quality.maximum, `${path}.quality.maximum`, 1);
  if (variant.quality.score > variant.quality.maximum || variant.quality.threshold > variant.quality.maximum) throw new RangeError(`${path}.quality score and threshold must not exceed maximum`);
  if (variant.quality.unit !== "fixture-points") throw new TypeError(`${path}.quality.unit must be fixture-points`);
  requireObject(variant.evidence, `${path}.evidence`);
  for (const key of ["artifact", "lineage", "runtime", "quality"]) requireString(variant.evidence[key], `${path}.evidence.${key}`);
  return variant;
}

export function predictedPayloadBytes(variant) {
  const bytes = variant.parameters * variant.measuredBpw / 8;
  if (!Number.isSafeInteger(bytes)) throw new RangeError(`${variant.id} predicted payload must be an exact safe integer byte count`);
  return bytes;
}

export function residentWeightBytesForRuntime(variant, payloadBytes) {
  if (variant.runtime.mode === "packed") return payloadBytes;
  if (variant.runtime.mode === "dequantized") {
    const bytes = variant.parameters * variant.runtime.denseBits / 8;
    if (!Number.isSafeInteger(bytes)) throw new RangeError(`${variant.id} dense resident weights must be an exact safe integer byte count`);
    return bytes;
  }
  return null;
}

export function analyzeVariant(variant) {
  validateVariant(variant);
  const payloadBytes = predictedPayloadBytes(variant);
  const overheadBytes = variant.actualFileBytes - payloadBytes;
  const discrepancyPercent = Math.abs(overheadBytes) / payloadBytes * 100;
  const residentWeightBytes = residentWeightBytesForRuntime(variant, payloadBytes);
  const memoryBudgetBytes = variant.memoryBudgetGiB * GIB;
  const holds = [];
  if (discrepancyPercent > 2) holds.push("size-discrepancy>2%");
  if (variant.lineage === "UNKNOWN") holds.push("lineage-unknown");
  if (variant.runtime.mode === "UNKNOWN") holds.push("runtime-unknown");
  if (variant.quality.score < variant.quality.threshold) holds.push("quality-below-threshold");
  if (residentWeightBytes !== null && residentWeightBytes > memoryBudgetBytes) holds.push("memory-budget-exceeded");
  return {id:variant.id,predictedPayloadBytes:payloadBytes,actualFileBytes:variant.actualFileBytes,overheadBytes,discrepancyPercent,residentWeightBytes,memoryBudgetBytes,holds,status:holds.length===0?"READY":"HOLD"};
}

export function analyzeManifest(manifest) {
  validateManifest(manifest);
  return manifest.map(analyzeVariant);
}
