import {calculate} from '../src/core.mjs';
export {ValidationError} from '../src/core.mjs';

export function plan(input) {
  const calculated = calculate(input);
  if ('status' in calculated) return calculated;
  const {checkedRequestedKvBytes, ...result} = calculated;
  const requiredKvBytes = checkedRequestedKvBytes;
  const status = result.maximumConcurrency >= 1 && requiredKvBytes <= result.kvBudgetBytes ? 'OK' : 'UNKNOWN';
  return {status,...result,requiredKvBytes};
}
