const uuid = require('short-uuid');
const http = require('http');
const WebSocket = require('ws');
const { scheduler } = require('../grpc/client');
const { runsInKubernetes } = require('../config');

const QUEUE_PLAYERS_REQUIRED = 2;
const QUEUE_CHECK_PERIOD = 2000;

const MSG_TYPE_JOIN = 'join';
const MSG_TYPE_ASSIGNED_PLAYER_ID = 'assigned-player-id';
const MSG_TYPE_OPPONENT_FOUND = 'opponent-found';
const MSG_TYPE_RUNNER_READY = 'runner-ready';

const queue = [];

const hub = new http.createServer();
const wss = new WebSocket.Server({
  server: hub,
  clientTracking: true,
});

function sendAssignedPlayerIdMessage(connection) {
  const message = JSON.stringify({
    type: MSG_TYPE_ASSIGNED_PLAYER_ID,
    data: {
      playerId: connection.id,
    },
  });

  connection.send(message);
}

function sendOpponentFoundMessage(connection) {
  const message = JSON.stringify({
    type: MSG_TYPE_OPPONENT_FOUND,
  });

  // TODO:
  // Error: WebSocket is not open: readyState 3 (CLOSED)
  //     at WebSocket.send (/app/node_modules/ws/lib/websocket.js:322:19)
  //     at sendOpponentFoundMessage (/app/src/ws/server.js:41:14)
  //     at Timeout.setInterval [as _onTimeout] (/app/src/ws/server.js:95:5)
  //     at listOnTimeout (timers.js:327:15)
  //     at processTimers (timers.js:271:5)
  connection.send(message);
}

function sendRunnerReadyMessage(connection, runner) {
  const message = JSON.stringify({
    type: MSG_TYPE_RUNNER_READY,
    data: {
      runner,
    },
  });

  connection.send(message);
}

function handleMessage(connection, data) {
  const message = JSON.parse(data);

  if (message.type === MSG_TYPE_JOIN) {
    connection.nickname = message.data.nickname;

    queue.push(connection);
  }
}

function handleClosedConnection(connection) {
  const { nickname } = connection;

  if (nickname) {
    const index = queue.findIndex(c => c.nickname === nickname);

    if (index !== -1) {
      queue.splice(index);
    }
  }
}

wss.on('connection', connection => {
  connection.id = uuid.generate();

  sendAssignedPlayerIdMessage(connection);

  connection.on('message', (data) => handleMessage(connection, data));
  connection.on('close', () => handleClosedConnection(connection));
});

// Periodically check the queue and spawn game runner if enough players are present in the queue
setInterval(() => {
  if (queue.length >= QUEUE_PLAYERS_REQUIRED) {
    const connections = queue.splice(0, QUEUE_PLAYERS_REQUIRED);
    const players = connections.map(c => { id: c.id });

    connections.forEach(connection => sendOpponentFoundMessage(connection));

    if (runsInKubernetes) {
      scheduler.SpawnGameRunner({
        player1: { id: 'f' },
        player2: { id: 'u' },
      }, (err, response) => {
        connections.forEach(connection => sendRunnerReadyMessage(connection, response.runner));
      });
    } else {
      const dummyRunner = 'DUMMY DUM DUM RUNNER';

      connections.forEach(connection => sendRunnerReadyMessage(connection, dummyRunner));
    }
  }
}, QUEUE_CHECK_PERIOD);

module.exports = { hub };
