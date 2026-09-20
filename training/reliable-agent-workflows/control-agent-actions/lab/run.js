#!/usr/bin/env node
import {createFixtures,getFixture} from './fixtures.js';
import {reconcileOperation} from './contract.js';

function usage(message) {
  if (message) console.error(message);
  console.error('Usage: node run.js (--all | --case ID) [--trace] [--recover]');
  process.exitCode = 2;
}
function parse(args) {
  const options = {all:false,caseId:null,trace:false,recover:false};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--all') { if (options.all) return {error:'Duplicate --all'}; options.all = true; }
    else if (arg === '--case') { if (options.caseId !== null) return {error:'Duplicate --case'}; if (!args[i + 1] || args[i + 1].startsWith('--')) return {error:'--case requires an ID'}; options.caseId = args[++i]; }
    else if (arg === '--trace') { if (options.trace) return {error:'Duplicate --trace'}; options.trace = true; }
    else if (arg === '--recover') { if (options.recover) return {error:'Duplicate --recover'}; options.recover = true; }
    else return {error:`Unknown option: ${arg}`};
  }
  if (options.all === Boolean(options.caseId)) return {error:'Choose exactly one of --all or --case ID'};
  return {options};
}
const parsed = parse(process.argv.slice(2));
if (parsed.error) usage(parsed.error);
else {
  const selected = parsed.options.all ? createFixtures() : [getFixture(parsed.options.caseId)];
  if (selected.some((x) => !x)) usage(`Unknown case: ${parsed.options.caseId}`);
  else for (const fixture of selected) {
    const output = fixture.run();
    console.log(`${fixture.id}: ${output.kind} callMutations=${output.callMutations} cumulativeMutations=${output.cumulativeMutations} receipts=${output.receiptCount}`);
    if (parsed.options.trace) console.log(JSON.stringify(output,null,2));
    if (parsed.options.recover && output.kind === 'uncertain') {
      const recovery = reconcileOperation(fixture.state.env,output.operationKey);
      console.log(`recovery: kind=${recovery.kind} query=${recovery.recovery?.query ?? 'none'} retryPerformed=${recovery.recovery?.retryPerformed ?? false} callMutations=${recovery.callMutations} cumulativeMutations=${recovery.cumulativeMutations} receipts=${recovery.receiptCount}`);
    }
  }
}
