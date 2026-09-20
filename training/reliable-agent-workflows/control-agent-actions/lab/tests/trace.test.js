import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {executeAction} from '../contract.js';
import {base} from '../fixtures.js';

const recordUrl = new URL('../records/worked-trace.json',import.meta.url);
function normalize(text) { return text.replace(/\r\n/g,'\n'); }

test('worked trace is the exact deterministic happy-path result',async () => {
  const x = base();
  const actual = `${JSON.stringify(executeAction(x.action,x.context,x.env),null,2)}\n`;
  const stored = await readFile(fileURLToPath(recordUrl),'utf8');
  assert.equal(normalize(stored),normalize(actual),'Regenerate worked-trace.json from a reviewed fresh happy-path result');
});
