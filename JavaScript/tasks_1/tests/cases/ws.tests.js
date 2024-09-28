const assert = require('node:assert');
const WebSocket = require('ws');

const assertWSOpen = target => assert.strictEqual(target.readyState, WebSocket.OPEN, 'readyState should be 1, Open');
const assertEmptyArray = data => assert.strictEqual(data.length, 0, 'Result should be an empty array');
const tests = {
  create({ data, target}, top) {
    top.test('create', () => {
      assertWSOpen(target);
      assertEmptyArray(data);
    });
  },
  read({ data, target, name, mask, entityId }, top) {
    top.test('read', () => {
      const actual = JSON.stringify(data);
      const expected = JSON.stringify([{ id: entityId, [name]: mask }]);
      assertWSOpen(target);
      assert.deepStrictEqual(actual, expected, `Result should get an user data`);
    });
  },
  find({ data, target, name, mask }, top) {
    top.test('find', () => {
      const [actual] = data.map(entity => entity[name]);
      const [expected] = [mask];
      assertWSOpen(target);
      assert.deepStrictEqual(actual, expected, 'Result should contain the correct user login');
    });
  },
  update({ data, target }, top) {
    top.test('update', () => {
      assertWSOpen(target);
      assertEmptyArray(data);
    });
  },
  delete({ data, target }, top) {
    top.test('delete', () => {
      assertWSOpen(target);
      assertEmptyArray(data);
    });
  }
};

module.exports = { tests };
