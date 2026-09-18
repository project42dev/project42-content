import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';

const files = readdirSync(new URL('../modules/', import.meta.url), { recursive: true }).filter(f => f.endsWith('.json'));
const modules = files.map(f => JSON.parse(readFileSync(new URL('../modules/' + f.replaceAll('\\', '/'), import.meta.url))));
const module = id => modules.find(m => m.id === id);
const code = (id, section) => module(id).sections.find(s => s.id === section).code.code;
function execute(source, globals, names) {
  return vm.runInNewContext(stripTypeScriptTypes(source.replaceAll('export async function', 'async function')) + `\n({${names.join(',')}})`, globals);
}

test('structured readers reject malformed, ambiguous, nonfinal, and refused responses without throwing', () => {
  const seen = [];
  const Ticket = { parse(value) { seen.push(value); if (!value || value.accepted !== true) throw Error('schema violation'); return value; } };
  const { readClaude, readResponses } = execute(code('structured-outputs-mastery', 'failures-the-guarantee-leaves'), { Ticket }, ['readClaude', 'readResponses']);
  const text = { type: 'output_text', text: '{"accepted":true}' };
  const response = (status, content) => ({ status, output: [{ type: 'message', content }] });
  assert.equal(readResponses(response('completed', [text])).ok, true);
  for (const status of ['queued', 'in_progress', 'failed', 'cancelled']) assert.equal(readResponses(response(status, [text])).reason, 'invalid');
  for (const content of [[], [{ ...text, text: '' }], [{ ...text, text: '{' }], [{ ...text, text: '{"accepted":false}' }], [text, text]])
    assert.equal(readResponses(response('completed', content)).reason, 'invalid');
  assert.equal(readResponses(response('incomplete', [text])).reason, 'truncated');
  const before = seen.length;
  assert.equal(readResponses(response('completed', [text, { type: 'refusal' }])).reason, 'refused');
  assert.equal(readResponses({ status: 'completed', output: [{ type: 'reasoning' }, { type: 'message', content: [text] }, { type: 'message', content: [{ type: 'refusal' }] }] }).reason, 'refused');
  assert.equal(seen.length, before, 'a later refusal must prevent schema parsing');
  assert.equal(readClaude({ stop_reason: 'end_turn', content: [{ type: 'text', text: '{"accepted":true}' }] }).ok, true);
  for (const [stop_reason, reason] of [['refusal', 'refused'], ['max_tokens', 'truncated'], ['tool_use', 'invalid'], [null, 'invalid']])
    assert.equal(readClaude({ stop_reason, content: [] }).reason, reason);
  assert.equal(readClaude({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'not JSON' }] }).reason, 'invalid');
});

test('SQL example validates before I/O and binds trusted identity within one transaction', async () => {
  const { runSqlTool } = execute(code('function-calling-and-tools', 'sql-tools-from-templates'), {}, ['runSqlTool']);
  const calls = [];
  const db = { async transaction(work) { calls.push('BEGIN'); const result = await work({ async query(sql, args) { calls.push({sql, args}); return { rows: [] }; } }); calls.push('COMMIT'); return result; } };
  for (const [name, input] of [['__proto__', {}], ['orders_get_status', {order_number: '1042', accountId: 'other'}], ['orders_get_status', {order_number: "1042' OR 1=1"}], ['orders_get_status', null]])
    assert.equal((await runSqlTool(db, name, input, {accountId: 'trusted'})).isError, true);
  assert.equal(calls.length, 0);
  assert.equal((await runSqlTool(db, 'orders_get_status', {order_number: '1042'}, {accountId: 'trusted'})).isError, false);
  assert.equal(calls.length, 4);
  assert.equal(calls[0], 'BEGIN'); assert.equal(calls[3], 'COMMIT');
  assert.equal(calls[1].sql, "SELECT set_config('app.account_id', $1, true)");
  assert.deepEqual(Array.from(calls[1].args), ['trusted']);
  assert.deepEqual(Array.from(calls[2].args), ['trusted', '1042']);
  const failed = await runSqlTool({transaction: async () => { throw Error('private connection information'); }}, 'orders_get_status', {order_number: '1042'}, {accountId: 'trusted'});
  assert.equal(failed.isError, true); assert.doesNotMatch(failed.text, /private connection/);
});

test('HTTP example rejects invalid or inherited actions before fetch', async () => {
  const calls = [];
  const { runHelpdesk } = execute(code('function-calling-and-tools', 'api-bridges'), { fetch: async (...args) => {calls.push(args); return {ok:true,text:async()=> 'ok'};} }, ['runHelpdesk']);
  const session = {userToken:'synthetic-test-token'};
  for (const input of [null, {action:'toString',ticket_id:null,comment:null}, {action:'get',ticket_id:'../other',comment:null}, {action:'get',ticket_id:'123',comment:null,url:'https://elsewhere.invalid'}, {action:'add_comment',ticket_id:'123',comment:''}])
    assert.equal((await runHelpdesk(input, session, 'https://helpdesk.invalid')).isError, true);
  assert.equal(calls.length, 0);
  assert.equal((await runHelpdesk({action:'get',ticket_id:'123',comment:null},session,'https://helpdesk.invalid')).isError, false);
  assert.equal(calls[0][0], 'https://helpdesk.invalid/tickets/123');
});

const repaired = ['agent-architecture-spectrum','agent-safety-and-spend-brakes','ai-compliance-and-crypto-receipts','dpo-and-model-evaluation','function-calling-and-tools','graph-rag-and-knowledge-graphs','guardrails-and-sandboxing','hardware-and-vram-calculator','lora-qlora-fine-tuning','model-context-protocol-mcp','multi-agent-orchestration','open-weights-and-quantization','owasp-top-10-llm-attacks','structured-outputs-mastery','token-economics-and-limits'];
test('repaired narration has complete matching transcripts and readable caption timing', () => {
  for (const id of repaired) {
    const script = module(id).instructorScript;
    const spoken = script.cues.filter(c=>['narration','assessment-handoff'].includes(c.kind));
    assert.equal(script.transcript, spoken.map(c=>c.text).join(' '), id);
    assert.equal(script.captions.length, spoken.length, id);
    let end = 0;
    for (let i=0;i<spoken.length;i++) {
      const cap=script.captions[i]; assert.equal(cap.cueId,spoken[i].id); assert.equal(cap.text,spoken[i].text); assert.equal(cap.startSeconds,end);
      const pace=cap.text.split(/\s+/).length*60/(cap.endSeconds-cap.startSeconds); assert.ok(pace>=90&&pace<=180, `${id}: ${pace}`); end=cap.endSeconds;
    }
    assert.equal(end,script.estimatedSeconds,id);
    for(const section of module(id).sections) if(section.code?.language==='json') assert.doesNotThrow(()=>JSON.parse(section.code.code),`${id}/${section.id}`);
  }
});
