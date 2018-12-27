const http = require('http');
const WebSocket = require('ws');

const { scheduler } = require('../grpc/client');
const { RUNNER_ID, PLAYER_ONE_ID, PLAYER_TWO_ID } = require('../config');
const { RULES } = require('../libs/rules');

const SELF_DESTRUCT_TIMEOUT = 60000;

let selfDestructTimeout = null;
const players = [];

const runner = new http.createServer();
const wss = new WebSocket.Server({
  server: runner,
});

const MSG_TYPE_PLAYER_AUTH = 'player-auth';
const MSG_TYPE_OPPONENT_JOINED = 'opponent-joined';
const MSG_TYPE_OPPONENT_LEFT = 'opponent-left';
const MSG_TYPE_CHOOSE_SHAPE = 'choose-shape';
const MSG_TYPE_OPPONENT_CHOSE = 'opponent-chose';
const MSG_TYPE_RESULTS = 'results';

function startNewRound() {
  const player1 = players[0];
  const player2 = players[1];

  player1.shape = null;
  player2.shape = null;
}

function checkGameResults() {
  const player1 = players[0];
  const player2 = players[1];

  // Check if both players have chosen shapes
  if (player1.shape && player2.shape) {
    const tie = player1.shape === player2.shape;
    const player1Wins = RULES[player1.shape] === player2.shape;

    if (!tie) {
      if (player1Wins) player1.score += 1;
      else player2.score += 1;
    }

    sendResults(player1);
    sendResults(player2);

    startNewRound();
  }
}

function sendOpponentJoinedMessage(player) {
  const message = JSON.stringify({
    type: MSG_TYPE_OPPONENT_JOINED,
  });

  player.send(message);
}

function sendOpponentLeftMessage(player) {
  const message = JSON.stringify({
    type: MSG_TYPE_OPPONENT_LEFT,
  });

  if (player.readyState === 1) {
    player.send(message);
  }
}

function sendOpponentChoseShape(player) {
  const message = JSON.stringify({
    type: MSG_TYPE_OPPONENT_CHOSE,
  });

  player.send(message);
}

function sendResults(player, opponentShape) {
  const { opponent } = player;

  const message = JSON.stringify({
    type: MSG_TYPE_RESULTS,
    data: {
      opponentShape: opponent.shape,
      score: [player.score, opponent.score],
    },
  });

  player.send(message);
}

function pairPlayersAsOpponents(player1, player2) {
  player1.opponent = player2;
  player2.opponent = player1;
}

function handleMessage(connection, data) {
  resetSelfDestructTimeout();
  const message = JSON.parse(data);

  if (message.type === MSG_TYPE_PLAYER_AUTH) {
    const { playerId } = message.data;

    if (playerId === PLAYER_ONE_ID || playerId === PLAYER_TWO_ID) {
      connection.id = playerId;
      players.push(connection);
    }

    if (players.length === 2) {
      const player1 = players[0];
      const player2 = players[1];

      pairPlayersAsOpponents(player1, player2);

      sendOpponentJoinedMessage(player1);
      sendOpponentJoinedMessage(player2);
    }
  }

  if (message.type === MSG_TYPE_CHOOSE_SHAPE) {
    if (!connection.shape) {
      const { shape } = message.data;

      connection.shape = shape;
    }

    sendOpponentChoseShape(connection.opponent);
    checkGameResults();
  }
}

function handleClosedConnection(connection) {
  const { id, opponent } = connection;

  const index = players.findIndex(p => p.id === id);
  if (index !== -1) {
    players.splice(index);
  }

  if (opponent) {
    sendOpponentLeftMessage(opponent);
  }
}


wss.on('connection', connection => {
  connection.score = 0;

  connection.on('message', (data) => handleMessage(connection, data));
  connection.on('close', () => handleClosedConnection(connection));
});


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

setSelfDestructTimeout();

module.exports = { runner };
