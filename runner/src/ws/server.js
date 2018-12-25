const http = require('http');
const WebSocket = require('ws');

const { PLAYER_ONE_ID, PLAYER_TWO_ID } = require('../config');

let counter = 0;
const players = [];

const runner = new http.createServer();
const wss = new WebSocket.Server({
  server: runner,
});

const MSG_TYPE_OPPONENT_JOINED = 'opponent-joined';
const MSG_TYPE_OPPONENT_LEFT = 'opponent-left';
const MSG_TYPE_CHOOSE_SHAPE = 'choose-shape';
const MSG_TYPE_OPPONENT_CHOSE = 'opponent-chose';
const MSG_TYPE_RESULTS = 'results';

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

  player.send(message);
}

function pairPlayersAsOpponents(player1, player2) {
  player1.opponent = player2;
  player2.opponent = player1;
}

function handleNewConnection(connection) {
  connection.id = counter;
  counter++;

  if (players.length < 2) {
    players.push(connection);

    if (players.length === 2) {
      const player1 = players[0];
      const player2 = players[1];

      pairPlayersAsOpponents(player1, player2);

      sendOpponentJoinedMessage(player1);
      sendOpponentJoinedMessage(player2);
    }
  }
}

function handleMessage(connection, data) {
  const message = JSON.parse(data);

  // TODO: handle game messages
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
  handleNewConnection(connection);

  connection.on('message', (data) => handleMessage(connection, data));
  connection.on('close', () => handleClosedConnection(connection));
});

module.exports = { runner };
