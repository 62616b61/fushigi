const http = require('http');
const WebSocket = require('ws');

const { scheduler } = require('../grpc/client');
const {
  RUNNER_ID,
  PLAYER_ONE_ID,
  PLAYER_TWO_ID,
  runsInKubernetes,
} = require('../config');
const Game = require('../libs/game');

const SELF_DESTRUCT_TIMEOUT = 60000;

let selfDestructTimeout = null;
const game = new Game();

const runner = new http.createServer();
const wss = new WebSocket.Server({
  server: runner,
});

function handleMessage(connection, data) {
  if (runsInKubernetes) resetSelfDestructTimeout();

  const message = JSON.parse(data);

  game.playerAction(connection, message.type, message.data);
}

function handleOpenedConnection(connection) {
  connection.on('message', (data) => handleMessage(connection, data));
  connection.on('close', () => handleClosedConnection(connection));
}

function handleClosedConnection(connection) {
  game.playerDisconnected(connection);
}

wss.on('connection', handleOpenedConnection);

// Self-destruct if there is no activity
function setSelfDestructTimeout() {
  selfDestructTimeout = setTimeout(() => {
    scheduler.TerminateGameRunner({ runner: RUNNER_ID }, (err, response) => {
      console.log('Bye!', err, response);
    });
  }, SELF_DESTRUCT_TIMEOUT);
}

function resetSelfDestructTimeout() {
  clearTimeout(selfDestructTimeout);

  setSelfDestructTimeout();
}

// Activate self destruct timer only if runtime is Kubernetes
if (runsInKubernetes) {
  setSelfDestructTimeout();
}

module.exports = { runner };
