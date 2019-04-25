const EventEmitter = require('events');
const Player = require('./player');
const Timer = require('./timer');

const {
  EVENT_ACTION,
  EVENT_GAME_STATE,
  EVENT_GAME_COUNTDOWN,
  EVENT_GAME_STATUS_CHANGED,
  EVENT_PLAYER_AUTHENTICATED,
  EVENT_PLAYER_DISCONNECTED,
  EVENT_PLAYER_CHOSE_SHAPE,
  EVENT_ROUND_FINISHED,
  EVENT_GAME_FINISHED,

  GAME_STATUS_IDLE,
  GAME_STATUS_WAITING,
  GAME_STATUS_PLAYING,
  GAME_STATUS_ROUND_FINISHED,
  GAME_STATUS_GAME_FINISHED,

  SHAPE_UNKNOWN,

  PLAYER_STATUS_DISCONNECTED,
} = require('./constants');

const WAITING_TIMEOUT = 2000;
const PLAYING_TIMEOUT = 5000;
const ROUND_FINISHED_TIMEOUT = 5000;
const GAME_FINISHED_TIMEOUT = 5000;

const events = new EventEmitter();

function emitLocally ({ id, type, data }) {
  events.emit(
    EVENT_ACTION,
    {
      type,
      origin: id,
      data,
      local: true,
    },
  );
}

function emitRemotely ({ id, type, data }) {
  events.emit(
    EVENT_ACTION,
    {
      type,
      origin: id,
      data,
      remote: true,
    },
  );
}

function getSelectedShapes(players) {
  const shapes = [];

  for (const player of players) {
    const { shape } = player;

    if (shape !== SHAPE_UNKNOWN && !shapes.includes(shape)) {
      shapes.push(shape);
    }

    if (shapes.length === 3) break;
  }

  return shapes;
}

function getWinningPlayers(players) {
  return players.filter(player => !player.lost);
}

function getDisconnectedPlayer(players) {
  return players.filter(player => player.status === PLAYER_STATUS_DISCONNECTED);
}

class Game {
  constructor() {
    this.players = [];
    this.status = GAME_STATUS_WAITING;
    this.timer = new Timer({
      tickCallback: (counter) => emitRemotely({ type: EVENT_GAME_COUNTDOWN, data: { counter } }),
    });
  }

  findPlayerById(id) {
    return this.players.find(p => p.id === id);
  }

  //getConnectedPlayers() {
    //return this.players.filter(p => p.status === STATUS_CONNECTED);
  //}

  //getConnectedOpponents(player) {
    //return this.players.filter(p => p.status === STATUS_CONNECTED && p.id && player.id);
  //}

  updateGameStatus(status) {
    this.status = status;

    emitLocally({ type: EVENT_GAME_STATUS_CHANGED, data: { status } });
    emitRemotely({ type: EVENT_GAME_STATUS_CHANGED, data: { status } });

    switch(status) {
      case GAME_STATUS_WAITING:
        this.timer.set(WAITING_TIMEOUT, () => {
          this.updateGameStatus(GAME_STATUS_PLAYING);
        });
        break;

      case GAME_STATUS_PLAYING:
        emitRemotely({
          type: EVENT_GAME_STATE,
          data: this.getCurrentGameState(),
        });

        this.timer.set(PLAYING_TIMEOUT, () => {
          this.finishRoundBefore();
        });
        break;

      case GAME_STATUS_ROUND_FINISHED:
        this.timer.set(ROUND_FINISHED_TIMEOUT, () => {
          this.updateGameStatus(GAME_STATUS_PLAYING);
        });
        break;

      case GAME_STATUS_GAME_FINISHED:
        this.timer.set(GAME_FINISHED_TIMEOUT, () => {
          this.updateGameStatus(GAME_STATUS_PLAYING);
        });
        break;
    }
  }

  finishRoundBefore() {
    // If there are only 2 shapes selected, the round is finished.
    const selectedShapes = getSelectedShapes(this.players);
    emitLocally({
      type: EVENT_ROUND_FINISHED,
      data: selectedShapes,
    });

    // If there is only one winning player, the game is finished.
    const winningPlayers = getWinningPlayers(this.players);
    if (winningPlayers.length === 1) {
      emitLocally({
        id: winningPlayers[0].id,
        type: EVENT_GAME_FINISHED,
      });

      emitRemotely({
        type: EVENT_GAME_STATE,
        data: this.getCurrentGameState(),
      });

      return this.updateGameStatus(GAME_STATUS_GAME_FINISHED);
    }

    emitRemotely({
      type: EVENT_GAME_STATE,
      data: this.getCurrentGameState(),
    });

    return this.updateGameStatus(GAME_STATUS_ROUND_FINISHED);
  }

  finishRoundAfter() {

  }

  getCurrentGameState() {
    const players = this.players.map(p => {
      const player = {
        id: p.id,
        score: p.score,
        shape: p.shape,
        lost: p.lost,
        status: p.status,
      };

      return player;
    });

    return {
      players,
      status: this.status,
    };
  }

  resetGameState() {
    console.log('!!!!RESETTING GAME STATE');

    this.players = [];
    this.timer.clear();
    this.status = GAME_STATUS_IDLE;
  }

  playerConnected(connection, id) {
    console.log('GAME - PLAYER CONNECTED', id);

    // check if possible reconnection
    let player = this.findPlayerById(id);
    if (!player) {
      player = new Player(events);

      this.players.push(player);
    }
    
    // if it is the second player, start waiting timer
    if (this.players.length === 2) {
      this.updateGameStatus(GAME_STATUS_WAITING);
    }

    player.register(id, connection);

    emitRemotely({
      id,
      type: EVENT_GAME_STATE,
      data: this.getCurrentGameState(),
    });
  }

  playerDisconnected(connection) {
    console.log('GAME - PLAYER DISCONNECTED', connection.id);

    const { id } = connection;


    emitLocally({
      id,
      type: EVENT_PLAYER_DISCONNECTED,
      data: { id }
    });

    emitRemotely({
      type: EVENT_PLAYER_DISCONNECTED,
      data: { id }
    });

    // TODO: trigger this only when running in docker-compose
    // Check if everyone is disconnected and reset the game state
    const disonnectedPlayers = getDisconnectedPlayer(this.players);
    if (disonnectedPlayers.length === this.players.length) {
      this.resetGameState();
    }
  }

  playerAction(connection, type, data) { 
    if (type === EVENT_PLAYER_AUTHENTICATED) {
      const { id } = data;

      this.playerConnected(connection, id);
    }

    const { id } = connection;

    emitLocally({ id, type, data });
    emitRemotely({ type, data });
  }
}

module.exports = Game;
