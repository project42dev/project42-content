import {calculate} from './core.mjs';
export {ValidationError} from './core.mjs';

export function plan(input) {
  const calculated = calculate(input);
  if ('status' in calculated) return calculated;
  const {checkedRequestedKvBytes, ...result} = calculated;

  // DELIBERATE DEFECT: this substitutes one sequence for the checked requested total.
  const requiredKvBytes = result.kvBytesPerSequence;

  const status = result.maximumConcurrency >= 1 && requiredKvBytes <= result.kvBudgetBytes ? 'OK' : 'UNKNOWN';
  return {status,...result,requiredKvBytes};
}
