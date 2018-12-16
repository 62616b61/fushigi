const { spawnRunner } = require('../../libs/spawner');

async function spawnGameRunner(call, callback) {
  const runnerId = await spawnRunner();

  callback(
    null,
    {
      runner: runnerId,
    },
  )
}

module.exports = spawnGameRunner;
