const { scheduler } = require('./grpc/client');
const { hub } = require('./ws/server');

setTimeout(() => {
  const player1 = { id: 1 };
  const player2 = { id: 2 };

  scheduler.SpawnGameRunner({player1, player2}, (err, response) => {
    console.log('Spawning Game Runner:', response, err);
  });
}, 5000);

hub.listen(3000);
console.log('ws server is up')
