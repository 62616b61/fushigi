const { spawnRunner } = require('../../libs/spawner');

async function spawnGameRunner(call, callback) {
  await spawnRunner();

  callback(
    null,
    {
      url: 'url-to-game-instance',
    },
  )
}

module.exports = spawnGameRunner;
