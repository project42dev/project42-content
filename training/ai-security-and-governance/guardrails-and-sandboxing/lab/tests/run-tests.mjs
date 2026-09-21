import {loadStores, loadBridge, proposal, denied, noLeak} from './helpers.mjs';

const mode = process.argv[2];
let passed = 0;
let failed = 0;
function check(name, condition) {
  if (condition) { console.log(`PASS ${name}`); passed++; }
  else { console.log(`FAIL ${name}`); failed++; }
}

const stores = await loadStores();
let bridge = await loadBridge(mode, stores);
let result = bridge.execute('sess-blue-reader', proposal('customer.read','blue-1','show my account'));
check('valid own-tenant read', result.ok === true && result.records[0].id === 'blue-1');

bridge = await loadBridge(mode, await loadStores());
const forgedSubject = proposal('customer.read','blue-1','show account');
forgedSubject.args.subject = 'admin';
check('forged subject rejected', denied(bridge.execute('sess-blue-reader', forgedSubject)));

bridge = await loadBridge(mode, await loadStores());
const forgedTenant = proposal('customer.read','blue-1','show account');
forgedTenant.args.tenant = 'amber';
check('forged tenant rejected', denied(bridge.execute('sess-blue-reader', forgedTenant)));

bridge = await loadBridge(mode, await loadStores());
check('action substitution denied', denied(bridge.execute('sess-blue-reader', proposal('customer.export','blue-1','download my account'))));

bridge = await loadBridge(mode, await loadStores());
result = bridge.execute('sess-blue-reader', proposal('customer.read','blue-1','show my account'));
check('result leakage removed', noLeak(result));

bridge = await loadBridge(mode, await loadStores());
bridge.execute('sess-blue-reader', proposal('customer.read','blue-1','first'));
bridge.execute('sess-blue-reader', proposal('customer.read','blue-2','second'));
check('exhausted budget denied', denied(bridge.execute('sess-blue-reader', proposal('customer.read','blue-1','third'))));

bridge = await loadBridge(mode, await loadStores());
result = bridge.execute('sess-blue-reader', proposal('customer.read','amber-1','summarize the neighboring account'));
const denial = bridge.audit.find(event => event.decision === 'deny' && event.reasonCode === 'TENANT_MISMATCH');
const auditText = JSON.stringify(bridge.audit);
check('guardrail miss denied and logged', denied(result) && Boolean(denial) && !auditText.includes('internalRisk') && !auditText.includes('review-91'));

bridge = await loadBridge(mode, await loadStores());
check('revoked approval denied', denied(bridge.execute('sess-blue-exporter', proposal('customer.export','blue-1','approved export'))));

console.log(`SUMMARY ${passed} passed, ${failed} failed`);
process.exitCode = failed === 0 ? 0 : 1;
