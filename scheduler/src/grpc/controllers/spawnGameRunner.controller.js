const { spawnRunner } = require('../../libs/kubernetes');

async function spawnGameRunner(call, callback) {
  const { player1, player2 } = call.request;
  const runnerId = await spawnRunner(player1, player2);

  callback(
    null,
    {
      runner: runnerId,
    },
  )
}

module.exports = spawnGameRunner;
