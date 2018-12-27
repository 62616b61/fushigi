const { terminateRunner } = require('../../libs/kubernetes');

async function terminateGameRunner(call, callback) {
  const { runner } = call.request;

  console.log('REQUEST', call.request)

  callback(null, null);

  await terminateRunner(runner);
}

module.exports = terminateGameRunner;
