'use strict';

const protocol = 'ws'; // ws, http
const API_ADDRESS = '127.0.0.1:8001';
const transport = {
  ws: (name, method) => (...args) => {
    const socket = new WebSocket(`ws://${API_ADDRESS}/`);
    const packet = { name, method, args };
    return new Promise((resolve, reject) => {
      socket.addEventListener('open', () => {
        socket.send(JSON.stringify(packet));
        socket.onmessage = event => {
          const data = JSON.parse(event.data);
          resolve({ data, target: event });
        };
      });
      socket.addEventListener('error', reject);
    });
  },
  http: (name, method, service) => async (...args) => {
    const { params, body } = service[method];
    const urlPath = params ? `/${args[0]}` : '';
    const record = body ? args[Number(!!params)] : null;
    const reqUrl = `http://${API_ADDRESS}/${name}/${method}${urlPath}`;
    const reqParams = {
      method: 'POST',
      body: JSON.stringify({
        meta: { params, body },
        ...(record && { record })
      })
    };
    const target = await fetch(reqUrl, reqParams);
    const data = await target.json();
    return { data, target };
  }
}

const scaffold = (structure, transport) => {
  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const method of methods) {
      api[serviceName][method] = transport(serviceName, method, service);
    }
  }
  return api;
};

const schema = {
  user: {
    create: { body: 'record' },
    read: { params: ['id'] },
    find: { params: ['mask'] },
    update: { params: ['id'], body: 'record' },
    delete: { params: ['id'] },
  },
  country: {
    create: { body: 'record' },
    read: { params: ['id'] },
    find: { params: ['mask'] },
    delete: { params: ['id'] },
  },
  city: {
    create: { body: 'record' },
    find: { params: ['mask'] },
    update: { params: ['id'], body: 'record' },
    delete: { params: ['id'] },
  }
}
const api = scaffold(schema, transport[protocol]);

(async () => {
  const { data } = await api.user.read(3);
  console.dir({ data });
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { schema, api };
}
