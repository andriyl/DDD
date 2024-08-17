const { test } = require('node:test');
const assert = require('node:assert');
const WebSocket = require('ws');
const { runTests } = require('../run');

const assertWSOpen = target => assert.strictEqual(target.readyState, WebSocket.OPEN, 'readyState should be 1, Open');
const assertEmptyArray = data => assert.strictEqual(data.length, 0, 'Result should be an empty array');
const tests = {
  create(apiOperation) {
    test('create', async () => {
      const { data, target } = await apiOperation();
      assertWSOpen(target);
      assertEmptyArray(data);
    });
  },
  read(apiOperation) {
    test('read', async () => {
      const { data, target, name, mask, entityId } = await apiOperation();
      const actual = JSON.stringify(data);
      const expected = JSON.stringify([{ id: entityId, [name]: mask }]);
      assertWSOpen(target);
      assert.deepStrictEqual(actual, expected, `Result should get an user data`);
    });
  },
  find(apiOperation) {
    test('find', async () => {
      const { data, target, name, mask } = await apiOperation();
      const [actual] = data.map(entity => entity[name]);
      const [expected] = [mask];
      assertWSOpen(target);
      assert.deepStrictEqual(actual, expected, 'Result should contain the correct user login');
    });
  },
  update(apiOperation) {
    test('update', async () => {
      const { data, target } = await apiOperation();
      assertWSOpen(target);
      assertEmptyArray(data);
    });
  },
  delete(apiOperation) {
    test('delete', async () => {
      const { data, target } = await apiOperation();
      assertWSOpen(target);
      assertEmptyArray(data);
    });
  }
}

runTests(tests);
