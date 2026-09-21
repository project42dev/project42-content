import { GateError, evaluateWithParser } from './policy.mjs';

function parseUniqueJson(text) {
  let index = 0;
  const fail = () => { throw new GateError('invalid_json'); };
  const space = () => { while (/\s/u.test(text[index] ?? '')) index += 1; };
  const pathFor = (base, key) => /^[A-Za-z_$][\w$]*$/u.test(key) ? `${base}.${key}` : `${base}[${JSON.stringify(key)}]`;

  function stringToken() {
    if (text[index] !== '"') fail();
    const start = index;
    index += 1;
    while (index < text.length) {
      const code = text.charCodeAt(index);
      if (code <= 0x1f) fail();
      if (text[index] === '\\') {
        index += 1;
        if (index >= text.length) fail();
        if (text[index] === 'u') {
          if (!/^[0-9a-fA-F]{4}$/u.test(text.slice(index + 1, index + 5))) fail();
          index += 5;
        } else {
          if (!/["\\/bfnrt]/u.test(text[index])) fail();
          index += 1;
        }
        continue;
      }
      if (text[index] === '"') {
        index += 1;
        try {
          return JSON.parse(text.slice(start, index));
        } catch {
          fail();
        }
      }
      index += 1;
    }
    fail();
  }

  function value(path) {
    space();
    if (text[index] === '{') return object(path);
    if (text[index] === '[') return array(path);
    if (text[index] === '"') {
      stringToken();
      return;
    }
    const start = index;
    while (index < text.length && !/[\s,\]}]/u.test(text[index])) index += 1;
    if (index === start) fail();
  }

  function object(path) {
    index += 1;
    const names = new Set();
    space();
    if (text[index] === '}') {
      index += 1;
      return;
    }
    while (index < text.length) {
      space();
      const key = stringToken();
      const keyPath = pathFor(path, key);
      if (names.has(key)) throw new GateError('duplicate_key', keyPath);
      names.add(key);
      space();
      if (text[index] !== ':') fail();
      index += 1;
      value(keyPath);
      space();
      if (text[index] === '}') {
        index += 1;
        return;
      }
      if (text[index] !== ',') fail();
      index += 1;
    }
    fail();
  }

  function array(path) {
    index += 1;
    let itemIndex = 0;
    space();
    if (text[index] === ']') {
      index += 1;
      return;
    }
    while (index < text.length) {
      value(`${path}[${itemIndex}]`);
      itemIndex += 1;
      space();
      if (text[index] === ']') {
        index += 1;
        return;
      }
      if (text[index] !== ',') fail();
      index += 1;
    }
    fail();
  }

  value('$');
  space();
  if (index !== text.length) fail();
  try {
    return JSON.parse(text);
  } catch {
    fail();
  }
}

export const evaluate = (bundle) => evaluateWithParser(bundle, parseUniqueJson);
