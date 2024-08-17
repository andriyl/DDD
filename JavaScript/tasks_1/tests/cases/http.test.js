const { test } = require('node:test');
const assert = require('node:assert');
const { runTests } = require('../run');

const assertHttpStatus = ({ status, statusText }) => {
  assert.strictEqual(status, 200, 'Status should be 200');
  assert.strictEqual(statusText, 'OK', 'statusText should be OK');
}
const assertEmptyArray = data => assert.deepStrictEqual(data, [], 'Result should be an empty array');
const tests = {
  create(apiOperation) {
    test('create', async () => {
      const { data, target } = await apiOperation();
      assertHttpStatus(target);
      assertEmptyArray(data);
    });
  },
  read(apiOperation) {
    test('read', async () => {
      const { data, target, name, mask, entityId } = await apiOperation();
      assertHttpStatus(target);
      assert.deepStrictEqual(data, [{ id: entityId, [name]: mask }], 'Result should get an user data');
    });
  },
  find(apiOperation) {
    test('find', async () => {
      const { data, target, name, mask } = await apiOperation();
      assertHttpStatus(target);
      const actualProp = data.map(entity => entity[name]);
      const expectedProps = [mask];
      assert.deepStrictEqual(actualProp, expectedProps, 'Result should contain the correct user login');
    });
  },
  update(apiOperation) {
    test('update', async () => {
      const { data, target } = await apiOperation();
      assertHttpStatus(target);
      assertEmptyArray(data);
    });
  },
  delete(apiOperation) {
    test('delete', async () => {
      const { data, target } = await apiOperation();
      assertHttpStatus(target);
      assertEmptyArray(data);
    });
  }
}

runTests(tests);
