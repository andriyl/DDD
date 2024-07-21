const { test } = require('node:test');
const assert = require('node:assert');
const { api, schema } = require('../static/client.js');
const { getRandomEntity, getPayloadMask, runApiTests } = require('./utils');

const tests = {
  create: (api, payload) => {
    test('create', async () => {
      const response = await api.create(payload);
      const json = await response.json();
      assert.strictEqual(response.status, 200, 'Status should be 200');
      assert.strictEqual(response.statusText, 'OK', 'statusText should be OK');
      assert.deepStrictEqual(json, [], 'Result should be an empty array');
    });
  },
  read: (api, payload) => {
    test('read', async () => {
      const { name, mask } = getPayloadMask(payload);
      const [ entity ] = await api.find(mask).then(res => res.json());
      const response = await api.read(entity.id);
      const json = await response.json();
      assert.strictEqual(response.status, 200, 'Status should be 200');
      assert.strictEqual(response.statusText, 'OK', 'statusText should be OK');
      assert.deepStrictEqual(json, [{ id: entity.id, [name]: mask }], 'Result should get an user data');
    });
  },
  find: (api, payload) => {
    test('find', async () => {
      const { name, mask } = getPayloadMask(payload);
      const response = await api.find(mask);
      const json = await response.json();
      assert.strictEqual(response.status, 200, 'Status should be 200');
      assert.strictEqual(response.statusText, 'OK', 'statusText should be OK');
      const actualProp = json.map(entity => entity[name]);
      const expectedProps = [mask];
      assert.deepStrictEqual(actualProp, expectedProps, 'Result should contain the correct user login');
    });
  },
  update: (api, payload) => {
    test('update', async () => {
      const { name, mask } = getPayloadMask(payload);
      const [ entity ] = await api.find(mask).then(res => res.json());
      payload[name] = 'updated'+ mask;
      const response = await api.update(entity.id, payload);
      const json = await response.json();
      assert.strictEqual(response.status, 200, 'Status should be 200');
      assert.strictEqual(response.statusText, 'OK', 'statusText should be OK');
      assert.deepStrictEqual(json, [], 'Result should be an empty array');
    });
  },
  delete: (api, payload) => {
    test('delete', async () => {
      const { mask } = getPayloadMask(payload);
      const [ entity ] = await api.find(mask).then(res => res.json());
      const response = await api.delete(entity.id);
      const json = await response.json();
      assert.strictEqual(response.status, 200, 'Status should be 200');
      assert.strictEqual(response.statusText, 'OK', 'statusText should be OK');
      assert.deepStrictEqual(json, [], 'Result should be an empty array');
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
