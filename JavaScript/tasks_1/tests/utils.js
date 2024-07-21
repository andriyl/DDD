const { describe } = require('node:test');

function getRandomEntity(prefix, length = 8) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return prefix + randomString;
}

function getPayloadMask(payload) {
  const name = Object.keys(payload)[0]
  return { name, mask: payload[name] }
}

function runApiTests(api, schema, tests, payloads) {
  for (const [entity, apiMethods] of Object.entries(api)) {
    describe(`${entity} CRUD`, () => {
      for (const [operation] of Object.entries(schema[entity])) {
        if (tests[operation]) {
          tests[operation](apiMethods, payloads[entity]);
        }
      }
    });
  }
}

module.exports = {
  getRandomEntity,
  getPayloadMask,
  runApiTests
}
