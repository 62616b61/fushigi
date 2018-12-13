const { scheduler } = require('./grpc/client');

setTimeout(() => {
  const player1 = { id: 1 };
  const player2 = { id: 2 };

  scheduler.SpawnGameRunner({player1, player2}, (err, response) => {
    console.log('Spawning Game Runner:', response, err);
  });
}, 1000);

// dont die
setInterval(() => {}, 100000);
