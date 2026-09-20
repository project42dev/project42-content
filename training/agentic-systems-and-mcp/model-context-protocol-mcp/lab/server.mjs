const VERSION = '2026-07-28';
const MAX_REQUEST_FRAME_BYTES = 4096;
const role = process.argv[2];
const expectedClient = process.env.EXPECTED_CLIENT_ID;

if (!['filesystem', 'issues'].includes(role) || !expectedClient) {
  console.error('usage: EXPECTED_CLIENT_ID=name node server.mjs filesystem|issues');
  process.exit(2);
}

const issues = new Map();
let input = Buffer.alloc(0);

const definitions = {
  filesystem: {
    tools: [{name: 'files.wordCount', description: 'Count words', inputSchema: {type: 'object'}}],
    resources: [{uri: 'file:///demo/readme.txt', name: 'demo readme'}],
    prompts: [{name: 'summarize-file', description: 'Create a local summary prompt'}]
  },
  issues: {
    tools: [
      {name: 'issues.create', description: 'Create an issue', inputSchema: {type: 'object'}},
      {name: 'issues.big', description: 'Return oversized output', inputSchema: {type: 'object'}},
      {name: 'issues.slowCreate', description: 'Create before delaying the response', inputSchema: {type: 'object'}},
      {name: 'issues.reconcile', description: 'Look up an operation key', inputSchema: {type: 'object'}}
    ],
    resources: [{uri: 'issue://DEMO-1', name: 'demonstration issue'}],
    prompts: [{name: 'triage-issue', description: 'Create an issue triage prompt'}]
  }
};

function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function exactKeys(value, required, optional = []) {
  if (!object(value)) return false;
  const keys = Object.keys(value);
  return required.every(key => keys.includes(key)) && keys.every(key => required.includes(key) || optional.includes(key));
}
function rpcError(id, code, message) {
  return {jsonrpc: '2.0', id: id ?? null, error: {code, message}};
}
function send(value) {
  process.stdout.write(JSON.stringify(value) + '\n');
}
function textArgs(args, required) {
  if (!exactKeys(args, required)) throw new Error(`arguments must contain only ${required.join(',')}`);
  for (const key of required) {
    if (typeof args[key] !== 'string' || args[key].length < 1 || args[key].length > 80) throw new Error(`${key} must be a 1..80 character string`);
  }
}
function validateMeta(params) {
  if (!object(params) || !object(params._meta)) throw new Error('params._meta is required');
  const meta = params._meta;
  if (!exactKeys(meta, [
    'io.modelcontextprotocol/protocolVersion',
    'io.modelcontextprotocol/clientInfo',
    'io.modelcontextprotocol/clientCapabilities'
  ])) throw new Error('invalid _meta shape');
  if (meta['io.modelcontextprotocol/protocolVersion'] !== VERSION) throw new Error('unsupported protocol version');
  const info = meta['io.modelcontextprotocol/clientInfo'];
  if (!exactKeys(info, ['name', 'version']) || info.name !== expectedClient || typeof info.version !== 'string') throw new Error('client identity mismatch');
  if (!object(meta['io.modelcontextprotocol/clientCapabilities'])) throw new Error('invalid client capabilities');
}
function validateParams(method, params) {
  validateMeta(params);
  const allowed = method === 'tools/call' ? ['_meta', 'name', 'arguments'] : method === 'resources/read' ? ['_meta', 'uri'] : method === 'prompts/get' ? ['_meta', 'name'] : ['_meta'];
  if (!exactKeys(params, ['_meta'], allowed.filter(key => key !== '_meta'))) throw new Error('invalid params shape');
}
async function dispatch(method, params) {
  validateParams(method, params);
  const d = definitions[role];
  if (method === 'server/discover') {
    return {
      resultType: 'complete',
      supportedVersions: [VERSION],
      capabilities: {tools: {listChanged: true}, resources: {}, prompts: {}},
      _meta: {'io.modelcontextprotocol/serverInfo': {name: role, version: '1.0.0'}},
      ttlMs: 1000,
      cacheScope: 'server'
    };
  }
  if (method === 'tools/list') return {tools: d.tools};
  if (method === 'resources/list') return {resources: d.resources};
  if (method === 'resources/templates/list') return {resourceTemplates: []};
  if (method === 'prompts/list') return {prompts: d.prompts};
  if (method === 'resources/read') {
    if (typeof params.uri !== 'string' || !d.resources.some(item => item.uri === params.uri)) throw new Error('unknown resource');
    return {contents: [{uri: params.uri, mimeType: 'text/plain', text: role === 'filesystem' ? 'Local demonstration content.' : 'DEMO-1 is open.'}]};
  }
  if (method === 'prompts/get') {
    if (typeof params.name !== 'string' || !d.prompts.some(item => item.name === params.name)) throw new Error('unknown prompt');
    return {messages: [{role: 'user', content: {type: 'text', text: role === 'issues' ? 'Triage the selected issue.' : 'Summarize the selected file.'}}]};
  }
  if (method === 'tools/call') {
    if (typeof params.name !== 'string' || !object(params.arguments)) throw new Error('invalid tool call');
    if (params.name === 'files.wordCount' && role === 'filesystem') {
      textArgs(params.arguments, ['text']);
      return {content: [{type: 'text', text: String(params.arguments.text.trim().split(/\s+/).filter(Boolean).length)}]};
    }
    if (params.name === 'issues.create' && role === 'issues') {
      textArgs(params.arguments, ['title', 'operationKey']);
      const record = {operationKey: params.arguments.operationKey, title: params.arguments.title, state: 'created'};
      issues.set(record.operationKey, record);
      return {content: [{type: 'text', text: `created:${record.title}`}], operationKey: record.operationKey};
    }
    if (params.name === 'issues.slowCreate' && role === 'issues') {
      textArgs(params.arguments, ['title', 'operationKey']);
      const record = {operationKey: params.arguments.operationKey, title: params.arguments.title, state: 'created'};
      issues.set(record.operationKey, record);
      await new Promise(resolve => setTimeout(resolve, 150));
      return {content: [{type: 'text', text: `created:${record.title}`}], operationKey: record.operationKey};
    }
    if (params.name === 'issues.reconcile' && role === 'issues') {
      textArgs(params.arguments, ['operationKey']);
      return {record: issues.get(params.arguments.operationKey) ?? null};
    }
    if (params.name === 'issues.big' && role === 'issues') {
      if (!exactKeys(params.arguments, [])) throw new Error('issues.big accepts no arguments');
      return {content: [{type: 'text', text: 'X'.repeat(600)}]};
    }
    throw new Error('unknown tool');
  }
  throw Object.assign(new Error('method not found'), {rpcCode: -32601});
}

async function handleLine(line) {
  let request;
  try {
    request = JSON.parse(line.toString('utf8'));
  } catch {
    send(rpcError(null, -32700, 'parse error'));
    return;
  }
  if (!exactKeys(request, ['jsonrpc', 'id', 'method', 'params']) || request.jsonrpc !== '2.0' || !(typeof request.id === 'string' || Number.isInteger(request.id)) || typeof request.method !== 'string') {
    send(rpcError(request?.id, -32600, 'invalid request'));
    return;
  }
  try {
    if (request.method === 'test/malformedResponse') {
      validateParams(request.method, request.params);
      process.stdout.write('{not-json\n');
      return;
    }
    if (request.method === 'test/doubleEnvelope') {
      validateParams(request.method, request.params);
      send({jsonrpc: '2.0', id: request.id, result: {}, error: {code: -32603, message: 'also error'}});
      return;
    }
    if (request.method === 'test/unknownResponse') {
      validateParams(request.method, request.params);
      send({jsonrpc: '2.0', id: request.id + 10000, result: {}});
      send({jsonrpc: '2.0', id: request.id, result: {}});
      return;
    }
    if (request.method === 'test/oversizedFrame') {
      validateParams(request.method, request.params);
      send({jsonrpc: '2.0', id: request.id, result: {text: 'Y'.repeat(10000)}});
      return;
    }
    if (request.method === 'test/stderrFlood') {
      validateParams(request.method, request.params);
      process.stderr.write('D'.repeat(2000));
      send({jsonrpc: '2.0', id: request.id, result: {ok: true}});
      return;
    }
    if (request.method === 'test/exit') {
      validateParams(request.method, request.params);
      process.exit(7);
    }
    if (request.method === 'test/hang') {
      validateParams(request.method, request.params);
      setInterval(() => {}, 1000);
      return;
    }
    const result = await dispatch(request.method, request.params);
    send({jsonrpc: '2.0', id: request.id, result});
  } catch (error) {
    send(rpcError(request.id, error.rpcCode ?? -32602, error.message));
  }
}

process.stdin.on('data', chunk => {
  input = Buffer.concat([input, chunk]);
  if (input.length > MAX_REQUEST_FRAME_BYTES && input.indexOf(10) === -1) {
    send(rpcError(null, -32600, 'request frame too large'));
    input = Buffer.alloc(0);
    return;
  }
  let newline;
  while ((newline = input.indexOf(10)) !== -1) {
    const line = input.subarray(0, newline);
    input = input.subarray(newline + 1);
    if (line.length > MAX_REQUEST_FRAME_BYTES) send(rpcError(null, -32600, 'request frame too large'));
    else void handleLine(line);
  }
});
process.stdin.on('end', () => {
  if (input.length) send(rpcError(null, -32700, 'unterminated JSON frame'));
});
