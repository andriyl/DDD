'use strict';

const http = require('node:http');
const { host, transport, statics } = require('../config');
const staticUrl = `${transport}://${host}:${statics.port}`;

const receiveArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

module.exports = (routing, port) => {
  http.createServer(async (req, res) => {
    const headers = {
      'Access-Control-Allow-Origin': staticUrl,
    };
    const { url, socket } = req;
    const [name, method, id] = url.substring(1).split('/');
    const entity = routing[name];
    if (!entity) return void res.end('Not found');
    const handler = entity[method];
    if (!handler) return void res.end('Not found');
    const src = handler.toString();
    const { meta, record } = await receiveArgs(req);
    const urlParam = meta.params?.[0];
    const signature = src.substring(0, src.indexOf(')'));
    const args = [];
    if (signature.includes(`(${urlParam}`)) args.push(id);
    if (signature.includes('{')) args.push(record);
    console.log(`${socket.remoteAddress} ${method} ${url}`);
    const result = await handler(...args);
    const status = result.rowCount ? 200 : 404;
    res.writeHead(status, headers);
    res.end(JSON.stringify(result.rows));
  }).listen(port);

  console.log(`API on port ${port}`);
};
