const http = require('http');
const WebSocket = require('ws');
const { scheduler } = require('../grpc/client');

const QUEUE_CHECK_PERIOD = 2000;
const MSG_TYPE_JOIN = 'join';
const MSG_TYPE_OPPONENT_FOUND = 'opponent-found';
const MSG_TYPE_RUNNER_READY = 'runner-ready';

const queue = [];

const hub = new http.createServer();
const wss = new WebSocket.Server({
  server: hub,
  clientTracking: true,
});

function sendOpponentFoundMessage(connection, opponentNickname) {
  const message = JSON.stringify({
    type: MSG_TYPE_OPPONENT_FOUND,
    opponentNickname,
  });

  connection.send(message);
}

function sendRunnerReadyMessage(connection, runner) {
  const message = JSON.stringify({
    type: MSG_TYPE_RUNNER_READY,
    runner,
  });

  connection.send(message);
}

function handleMessage(connection, data) {
  const message = JSON.parse(data);

  if (message.type === MSG_TYPE_JOIN) {
    connection.nickname = message.nickname;

    queue.push(connection);
  }
}

function handleClosedConnection(connection) {
  const { nickname } = connection;

  console.log('BEFORE', queue)
  if (nickname) {
    const index = queue.findIndex(c => c.nickname === nickname);

    if (index !== -1) {
      queue.splice(index);
      console.log('AFTER', queue)
    }
  }
}

wss.on('connection', connection => {
  connection.on('message', (data) => handleMessage(connection, data));
  connection.on('close', () => handleClosedConnection(connection));
});

// Periodically check the queue and spawn game runner if enough players are present in the queue
setInterval(() => {
  console.log('QUEUE SIZE', queue.length)
  if (queue.length >= 2) {
    const player1 = queue.shift();
    const player2 = queue.shift();

    sendOpponentFoundMessage(player1, player2.nickname);
    sendOpponentFoundMessage(player2, player1.nickname);

    scheduler.SpawnGameRunner({}, (err, response) => {
      console.log('Spawning Game Runner:', response, err);
      sendRunnerReadyMessage(player1, response.runner);
      sendRunnerReadyMessage(player2, response.runner);
    });

    console.log('THERE ARE TWO PLAYERS WILLING TO PLAY');
  }
}, QUEUE_CHECK_PERIOD);

module.exports = { hub };
