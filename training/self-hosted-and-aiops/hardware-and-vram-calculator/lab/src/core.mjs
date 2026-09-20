export class ValidationError extends Error {}

const object = (value, path) => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new ValidationError(`${path} must be an object`);
  return value;
};
const string = (value, path) => {
  if (typeof value !== 'string' || value.length === 0) throw new ValidationError(`${path} must be a nonempty string`);
  return value;
};
const finite = (value, path) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new ValidationError(`${path} must be finite`);
  return value;
};
const positiveInteger = (value, path) => {
  finite(value, path);
  if (!Number.isSafeInteger(value) || value <= 0) throw new ValidationError(`${path} must be a positive safe integer`);
  return value;
};
const nonnegativeInteger = (value, path) => {
  finite(value, path);
  if (!Number.isSafeInteger(value) || value < 0) throw new ValidationError(`${path} must be a nonnegative safe integer`);
  return value;
};
const choice = (value, allowed, path) => {
  if (!allowed.includes(value)) throw new ValidationError(`${path} must be one of ${allowed.join(', ')}`);
  return value;
};
export const safeProduct = (values, path) => {
  let result = 1;
  for (const value of values) {
    if (!Number.isSafeInteger(value)) throw new ValidationError(`${path} requires safe integer factors`);
    result *= value;
    if (!Number.isSafeInteger(result)) throw new ValidationError(`${path} exceeds safe integer arithmetic`);
  }
  return result;
};
const representedBytes = (parameters, bits, path) => {
  const raw = parameters * bits / 8;
  if (!Number.isFinite(raw) || raw > Number.MAX_SAFE_INTEGER) throw new ValidationError(`${path} exceeds safe arithmetic`);
  return Math.ceil(raw);
};

export function calculate(input) {
  object(input, 'root');
  const evidence = object(input.evidence, 'evidence');
  const artifact = object(input.artifact, 'artifact');
  const runtime = object(input.runtime, 'runtime');
  const architecture = object(input.architecture, 'architecture');
  const hardware = object(input.hardware, 'hardware');
  const budget = object(input.budget, 'budget');
  const workload = object(input.workload, 'workload');

  choice(evidence.kind, ['synthetic'], 'evidence.kind');
  if (evidence.realHardwareMeasured !== false) throw new ValidationError('evidence.realHardwareMeasured must be false for this lab');
  choice(evidence.throughput, ['UNMEASURED'], 'evidence.throughput');
  choice(evidence.latency, ['UNMEASURED'], 'evidence.latency');

  string(artifact.id, 'artifact.id');
  choice(artifact.format, ['synthetic-packed', 'synthetic-dense'], 'artifact.format');
  const parameterCount = positiveInteger(artifact.parameterCount, 'artifact.parameterCount');
  const measuredBitsPerWeight = finite(artifact.measuredBitsPerWeight, 'artifact.measuredBitsPerWeight');
  if (measuredBitsPerWeight <= 0) throw new ValidationError('artifact.measuredBitsPerWeight must be positive');
  const artifactBytes = representedBytes(parameterCount, measuredBitsPerWeight, 'artifactBytes');

  string(runtime.name, 'runtime.name');
  const weightRepresentation = choice(runtime.weightRepresentation, ['packed', 'dequantized', 'UNKNOWN'], 'runtime.weightRepresentation');
  let residentWeightBytes;
  if (weightRepresentation === 'packed') {
    if (runtime.denseWeightDtypeBits !== undefined) throw new ValidationError('runtime.denseWeightDtypeBits is only valid for dequantized weights');
    residentWeightBytes = artifactBytes;
  } else if (weightRepresentation === 'dequantized') {
    const denseBits = choice(runtime.denseWeightDtypeBits, [8, 16, 32], 'runtime.denseWeightDtypeBits');
    residentWeightBytes = representedBytes(parameterCount, denseBits, 'residentWeightBytes');
  } else if (runtime.denseWeightDtypeBits !== undefined) {
    throw new ValidationError('runtime.denseWeightDtypeBits must be omitted when representation is UNKNOWN');
  }
  choice(runtime.kvDtype, ['fp16', 'bf16', 'fp8'], 'runtime.kvDtype');
  const bytesPerElement = positiveInteger(runtime.bytesPerElement, 'runtime.bytesPerElement');
  const expectedBytes = runtime.kvDtype === 'fp8' ? 1 : 2;
  if (bytesPerElement !== expectedBytes) throw new ValidationError('runtime.bytesPerElement does not match runtime.kvDtype');

  string(architecture.family, 'architecture.family');
  const modelKind = choice(architecture.modelKind, ['dense', 'moe'], 'architecture.modelKind');
  const attentionKind = choice(architecture.attentionKind, ['full-mha', 'full-gqa', 'mla', 'sliding-window', 'hybrid'], 'architecture.attentionKind');
  const layers = positiveInteger(architecture.layers, 'architecture.layers');
  const queryHeads = positiveInteger(architecture.queryHeads, 'architecture.queryHeads');
  const kvHeads = positiveInteger(architecture.kvHeads, 'architecture.kvHeads');
  const headDim = positiveInteger(architecture.headDim, 'architecture.headDim');
  if (attentionKind === 'full-mha' && kvHeads !== queryHeads) throw new ValidationError('full-mha requires kvHeads to equal queryHeads');
  if (attentionKind === 'full-gqa' && queryHeads % kvHeads !== 0) throw new ValidationError('full-gqa requires queryHeads divisible by kvHeads');
  if (typeof architecture.offload !== 'boolean') throw new ValidationError('architecture.offload must be boolean');
  const tensorParallel = positiveInteger(architecture.tensorParallel, 'architecture.tensorParallel');

  const deviceCount = positiveInteger(hardware.deviceCount, 'hardware.deviceCount');
  const deviceMemoryBytes = positiveInteger(hardware.deviceMemoryBytes, 'hardware.deviceMemoryBytes');
  choice(hardware.memoryUnit, ['bytes'], 'hardware.memoryUnit');
  const utilization = finite(budget.utilization, 'budget.utilization');
  if (utilization <= 0 || utilization > 1) throw new ValidationError('budget.utilization must be in (0, 1]');
  const nonKvOverheadBytes = nonnegativeInteger(budget.nonKvOverheadBytes, 'budget.nonKvOverheadBytes');
  const reserveBytes = nonnegativeInteger(budget.reserveBytes, 'budget.reserveBytes');
  const promptTokens = nonnegativeInteger(workload.promptTokens, 'workload.promptTokens');
  const generatedTokens = nonnegativeInteger(workload.generatedTokens, 'workload.generatedTokens');
  const requestedSequences = positiveInteger(workload.requestedSequences, 'workload.requestedSequences');
  choice(workload.tokenUnit, ['tokens'], 'workload.tokenUnit');
  const tokensPerSequence = promptTokens + generatedTokens;
  if (!Number.isSafeInteger(tokensPerSequence) || tokensPerSequence <= 0) throw new ValidationError('total tokens per sequence must be positive and safe');

  if (deviceCount !== 1) return {status:'UNKNOWN',reason:'single-device planner requires deviceCount=1',artifactBytes,weightRepresentation};
  if (!['full-mha', 'full-gqa'].includes(attentionKind) || modelKind === 'moe' || architecture.offload || tensorParallel !== 1) {
    return {status:'UNKNOWN',reason:'unsupported architecture or placement; revised evidence required',artifactBytes,weightRepresentation};
  }
  if (weightRepresentation === 'UNKNOWN') {
    return {status:'UNKNOWN',reason:'runtime-resident weight representation is UNKNOWN',artifactBytes,weightRepresentation};
  }

  const usableDeviceBudgetBytes = Math.floor(deviceMemoryBytes * utilization);
  if (!Number.isSafeInteger(usableDeviceBudgetBytes)) throw new ValidationError('usableDeviceBudgetBytes exceeds safe arithmetic');
  const kvBudgetBytes = usableDeviceBudgetBytes - residentWeightBytes - nonKvOverheadBytes - reserveBytes;
  const kvBytesPerToken = safeProduct([2, layers, kvHeads, headDim, bytesPerElement], 'kvBytesPerToken');
  const kvBytesPerSequence = safeProduct([kvBytesPerToken, tokensPerSequence], 'kvBytesPerSequence');
  const checkedRequestedKvBytes = safeProduct([kvBytesPerSequence, requestedSequences], 'requiredKvBytes');
  const maximumConcurrency = kvBudgetBytes > 0 ? Math.floor(kvBudgetBytes / kvBytesPerSequence) : 0;

  return {artifactBytes,residentWeightBytes,weightRepresentation,kvBytesPerToken,tokensPerSequence,usableDeviceBudgetBytes,nonKvOverheadBytes,reserveBytes,kvBudgetBytes,kvBytesPerSequence,requestedSequences,checkedRequestedKvBytes,maximumConcurrency};
}
