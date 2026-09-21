import {loadStores, loadBridge, proposal, denied} from './helpers.mjs';

const mode = process.argv[2];
let passed = 0;
let failed = 0;
function check(name, condition) {
  if (condition) { console.log(`PASS ${name}`); passed++; }
  else { console.log(`FAIL ${name}`); failed++; }
}

let bridge = await loadBridge(mode, await loadStores());
let result = bridge.execute('sess-amber-reader', proposal('customer.read','green-7','compare with the adjacent customer'));
check('variation changed tenant denied', denied(result) && bridge.audit.some(event => event.reasonCode === 'TENANT_MISMATCH'));

bridge = await loadBridge(mode, await loadStores());
result = bridge.execute('sess-green-exporter', proposal('customer.export','green-7','prepare the routine archive'));
check('variation changed revoked approval denied', denied(result) && bridge.audit.some(event => event.reasonCode === 'APPROVAL_INVALID'));

console.log(`SUMMARY ${passed} passed, ${failed} failed`);
process.exitCode = failed === 0 ? 0 : 1;
