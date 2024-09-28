const assert = require('node:assert');
const assertHttpStatus = ({ status, statusText }) => {
  assert.strictEqual(status, 200, 'Status should be 200');
  assert.strictEqual(statusText, 'OK', 'statusText should be OK');
}
const assertEmptyArray = data => assert.deepStrictEqual(data, [], 'Result should be an empty array');
const tests = {
  create({ data, target }, top) {
    top.test('create', () => {
      assertHttpStatus(target);
      assertEmptyArray(data);
    });
  },
  read({ data, target, name, mask, entityId }, top) {
    top.test('read', () => {
      assertHttpStatus(target);
      assert.deepStrictEqual(data, [{ id: entityId, [name]: mask }], 'Result should get an user data');
    });
  },
  find({ data, target, name, mask }, top) {
    top.test('find', () => {
      assertHttpStatus(target);
      const actualProp = data.map(entity => entity[name]);
      const expectedProps = [mask];
      assert.deepStrictEqual(actualProp, expectedProps, 'Result should contain the correct user login');
    });
  },
  update({ data, target }, top) {
    top.test('update', () => {
      assertHttpStatus(target);
      assertEmptyArray(data);
    });
  },
  delete({ data, target }, top) {
    top.test('delete', () => {
      assertHttpStatus(target);
      assertEmptyArray(data);
    });
  }
}

module.exports = { tests };
