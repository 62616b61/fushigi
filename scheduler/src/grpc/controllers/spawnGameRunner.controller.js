async function spawnGameRunner(call, callback) {
  callback(
    null,
    {
      url: 'url-to-game-instance',
    },
  )
}

module.exports = spawnGameRunner;
