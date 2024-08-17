const path = require('node:path');
const fs = require('node:fs');
const vm = require('node:vm');
const WebSocket = require('ws');
const { describe } = require('node:test');
const { operations } = require('./crud');
const { payloads } = require('./payloads');
const { host, port, transport } = require('../config');

async function getClientApiSchema() {
  const filePath = path.join(__dirname, '../static/client.js');
  const src = await fs.promises.readFile(filePath, 'utf8');
  const code = `(function() {${src} return { api, schema }})()`;
  const context = vm.createContext({
    __filename: filePath,
    __dirname: path.dirname(filePath),
    fetch,
    WebSocket
  });
  const script = new vm.Script(code);
  return script.runInContext(context);
}

async function isWSReady() {
   return new Promise((resolve, reject) => {
    const socket = new WebSocket(`ws://${host}:${port}`);
    const message = `Connection server error - state: ${socket.readyState}, please run server and try again\n`
    socket.once('error', () => reject(message));
    socket.once('open', () => {
      const isOpened = socket.readyState === WebSocket.OPEN;
      if (isOpened) return void resolve(socket);
      reject(message);
    });
  });
}

async function isHttpReady() {
  const log = err => {
    const message = `Server is not running: ${err?.message || 'Unknown error'}, please run server and try again\n`;
    console.error(message);
  }
  try {
    const response = await fetch(`http://${host}:${port}`);
    if (!response.ok) log();
    return response.ok;
  } catch (error) {
    log(error);
  }
}

function isServerRunning() {
  const server = {
    http: isHttpReady,
    ws: isWSReady,
  };
  return server[transport]();
}

async function runTests(tests) {
  const server = await isServerRunning().catch(console.log)
  if (!server) return
  const { api, schema } = await getClientApiSchema();
  for (const [entity, apiMethods] of Object.entries(api)) {
    describe(`${entity} CRUD`, () => {
      for (const [operation] of Object.entries(schema[entity])) {
        if (tests[operation]) {
          const apiOperation = () => operations[operation](apiMethods, payloads[entity]);
          tests[operation](apiOperation);
        }
      }
    });
  }
}

module.exports = { runTests };
