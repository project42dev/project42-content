import {readFile} from 'node:fs/promises';
import {plan, ValidationError} from '../src/planner.mjs';

const freeze = value => {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    for (const child of Object.values(value)) freeze(child);
  }
  return value;
};
const load = async name => freeze(JSON.parse(await readFile(new URL(`../fixtures/${name}`, import.meta.url), 'utf8')));
const clone = value => structuredClone(value);
const baseline = await load('baseline.json');
const changed = await load('changed-concurrency.json');
const dequantized = await load('dequantized-fp16.json');
const unknown = await load('unknown-residency.json');
const altered = (source, mutate) => { const value=clone(source); mutate(value); return freeze(value); };
const expectValidation = value => {
  try { plan(value); } catch (error) { if (error instanceof ValidationError) return; throw error; }
  throw Error('expected ValidationError');
};
const exact = freeze({
  evidence:{kind:'synthetic',realHardwareMeasured:false,throughput:'UNMEASURED',latency:'UNMEASURED'},
  artifact:{id:'exact',format:'synthetic-packed',parameterCount:20,measuredBitsPerWeight:8},
  runtime:{name:'offline-planner',weightRepresentation:'packed',kvDtype:'fp8',bytesPerElement:1},
  architecture:{family:'test',modelKind:'dense',attentionKind:'full-gqa',layers:1,queryHeads:1,kvHeads:1,headDim:1,offload:false,tensorParallel:1},
  hardware:{deviceCount:1,deviceMemoryBytes:100,memoryUnit:'bytes'},
  budget:{utilization:1,nonKvOverheadBytes:10,reserveBytes:10},
  workload:{promptTokens:10,generatedTokens:0,requestedSequences:3,tokenUnit:'tokens'}
});
const cases = [
  ['baseline multiplies all simultaneous sequences', () => { const r=plan(baseline); if(r.artifactBytes!==4894400000||r.residentWeightBytes!==4894400000||r.requiredKvBytes!==2684354560||r.maximumConcurrency!==8||r.status!=='OK') throw Error('baseline mismatch'); }],
  ['changed input fails closed above maximum concurrency', () => { const r=plan(changed); if(r.requiredKvBytes!==6039797760||r.status!=='UNKNOWN') throw Error('changed mismatch'); }],
  ['zero negative and noninteger dimensions are invalid', () => { expectValidation(altered(baseline,v=>v.architecture.layers=0)); expectValidation(altered(baseline,v=>v.architecture.kvHeads=-1)); expectValidation(altered(baseline,v=>v.architecture.headDim=1.5)); }],
  ['invalid KV dtype and byte mismatch are rejected', () => { expectValidation(altered(baseline,v=>v.runtime.kvDtype='int4')); expectValidation(altered(baseline,v=>v.runtime.bytesPerElement=1)); }],
  ['runtime weight representations compute or hold safely', () => { const d=plan(dequantized); if(d.artifactBytes!==4894400000||d.residentWeightBytes!==16000000000||d.status!=='UNKNOWN'||d.maximumConcurrency!==0) throw Error('dequantized mismatch'); const u=plan(unknown); if(u.status!=='UNKNOWN'||u.reason!=='runtime-resident weight representation is UNKNOWN'||'residentWeightBytes' in u) throw Error('unknown mismatch'); expectValidation(altered(dequantized,v=>v.runtime.denseWeightDtypeBits=-16)); }],
  ['insufficient memory is UNKNOWN', () => { const r=plan(altered(baseline,v=>v.hardware.deviceMemoryBytes=1000000000)); if(r.status!=='UNKNOWN'||r.maximumConcurrency!==0) throw Error('insufficient mismatch'); }],
  ['exact fit succeeds', () => { const r=plan(exact); if(r.kvBudgetBytes!==60||r.requiredKvBytes!==60||r.maximumConcurrency!==3||r.status!=='OK') throw Error('exact mismatch'); }],
  ['one beyond exact fit is infeasible', () => { const r=plan(altered(exact,v=>v.workload.requestedSequences=4)); if(r.requiredKvBytes!==80||r.status!=='UNKNOWN') throw Error('over-fit mismatch'); }],
  ['MHA and GQA head relationships are validated', () => { expectValidation(altered(baseline,v=>{v.architecture.attentionKind='full-mha';v.architecture.kvHeads=8;})); expectValidation(altered(baseline,v=>v.architecture.queryHeads=30)); }],
  ['shape enums and requested product are validated', () => { expectValidation([]); expectValidation(altered(baseline,v=>v.hardware.memoryUnit='GiB')); expectValidation(altered(baseline,v=>{v.workload.promptTokens=Number.MAX_SAFE_INTEGER;v.workload.generatedTokens=0;v.workload.requestedSequences=2;})); }]
];
const failures=[];
let passed=0;
for (const [name,run] of cases) {
  try { await run(); passed++; } catch { failures.push(name); }
}
console.log(JSON.stringify({passed,failed:failures.length,failures}));
process.exitCode=failures.length===0?0:1;
