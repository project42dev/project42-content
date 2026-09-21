import {readFile} from 'node:fs/promises';

const root = new URL('../', import.meta.url);
async function json(name) { return JSON.parse(await readFile(new URL(`fixtures/${name}.json`, root), 'utf8')); }

export async function loadStores() {
  return {
    customers:await json('customers'),
    sessions:await json('sessions'),
    approvals:await json('approvals'),
    nowMs:Date.parse('2026-09-21T12:00:00.000Z')
  };
}

export async function loadBridge(mode, stores) {
  if (mode === 'starter') return (await import('../src/bridge.mjs')).createBridge(stores);
  if (mode === 'reference') return (await import('../reference/reference-bridge.mjs')).createBridge(stores);
  throw new Error('usage: mode must be starter or reference');
}

export function proposal(tool, customerId, note, extra = {}) {
  const args = tool === 'customer.read' ? {customerId, fields:['name','email']} : {customerId, format:'json'};
  return {tool, args:{...args, ...extra}, note};
}

export function denied(value) { return value?.ok === false && value?.error === 'request_denied'; }
export function noLeak(value) { return value?.ok === true && !JSON.stringify(value).includes('internalRisk') && !JSON.stringify(value).includes('serviceTrace'); }
