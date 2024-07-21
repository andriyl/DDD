const { test } = require('node:test');
const assert = require('node:assert');
const { api, schema } = require('../static/client.js');
const { getRandomEntity, getPayloadMask, runApiTests } = require('./utils');

const tests = {
  create: (api, payload) => {
    test('create', async () => {
      const { data, target } = await api.create(payload);
      assert.strictEqual(target.status, 200, 'Status should be 200');
      assert.strictEqual(target.statusText, 'OK', 'statusText should be OK');
      assert.deepStrictEqual(data, [], 'Result should be an empty array');
    });
  },
  read: (api, payload) => {
    test('read', async () => {
      const { name, mask } = getPayloadMask(payload);
      const [ entity ] = (await api.find(mask)).data;
      const { data, target } = await api.read(entity.id);
      assert.strictEqual(target.status, 200, 'Status should be 200');
      assert.strictEqual(target.statusText, 'OK', 'statusText should be OK');
      assert.deepStrictEqual(data, [{ id: entity.id, [name]: mask }], 'Result should get an user data');
    });
  },
  find: (api, payload) => {
    test('find', async () => {
      const { name, mask } = getPayloadMask(payload);
      const { data, target } = await api.find(mask);
      assert.strictEqual(target.status, 200, 'Status should be 200');
      assert.strictEqual(target.statusText, 'OK', 'statusText should be OK');
      const actualProp = data.map(entity => entity[name]);
      const expectedProps = [mask];
      assert.deepStrictEqual(actualProp, expectedProps, 'Result should contain the correct user login');
    });
  },
  update: (api, payload) => {
    test('update', async () => {
      const { name, mask } = getPayloadMask(payload);
      const [ entity ] = (await api.find(mask)).data;
      payload[name] = 'updated'+ mask;
      const { data, target } = await api.update(entity.id, payload);
      assert.strictEqual(target.status, 200, 'Status should be 200');
      assert.strictEqual(target.statusText, 'OK', 'statusText should be OK');
      assert.deepStrictEqual(data, [], 'Result should be an empty array');
    });
  },
  delete: (api, payload) => {
    test('delete', async () => {
      const { mask } = getPayloadMask(payload);
      const [ entity ] = (await api.find(mask)).data;
      const { data, target } = await api.delete(entity.id);
      assert.strictEqual(target.status, 200, 'Status should be 200');
      assert.strictEqual(target.statusText, 'OK', 'statusText should be OK');
      assert.deepStrictEqual(data, [], 'Result should be an empty array');
    });
  }
}

const payloads = {
  user: {
    login: getRandomEntity('user_'),
    password: 'ypMEd9FwvtlOjcvH94iICQ==:V6LnSOVwXzENxeLCJk59Toadea7oaA1IxYulAOtKkL9tBxjEPOw085vYalEdLDoe8xbrXQlhh7QRGzrSe8Bthw=='
  },
  country: {
    name: getRandomEntity('Brazil_'),
  },
  city: {
    name: getRandomEntity('Lviv_'),
    country: 1
  }
}

runApiTests(api, schema, tests, payloads);
