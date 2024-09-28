const { it } = require('node:test');
const { transport } = require('../config');
const { tests } = require(`./cases/${transport}.tests.js`);
const { runTests } = require('./run.js');

it('tests', async (top) => {
  await runTests(tests, top);
  setTimeout(() => process.exit(0),0);
});