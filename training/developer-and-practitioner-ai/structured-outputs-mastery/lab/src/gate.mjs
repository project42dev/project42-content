import { evaluateWithParser } from './policy.mjs';

function parseUniqueJson(text) {
  // INTENDED DEFECT: JSON.parse loses evidence that duplicate keys existed.
  return JSON.parse(text);
}

export const evaluate = (bundle) => evaluateWithParser(bundle, parseUniqueJson);
