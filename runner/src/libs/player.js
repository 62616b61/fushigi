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

  GAME_STATUS_ROUND_FINISHED,
  GAME_STATUS_GAME_FINISHED,

  SHAPE_UNKNOWN,
  SHAPE_ROCK,
  SHAPE_PAPER,
  SHAPE_SCISSORS,

  PLAYER_STATUS_DISCONNECTED,
  PLAYER_STATUS_CONNECTED,
  PLAYER_STATUS_PLAYING,
  PLAYER_STATUS_CHOSE_SHAPE,
} = require('./constants');

const GAME_RULES = {
  [ SHAPE_ROCK ]: SHAPE_SCISSORS,
  [ SHAPE_PAPER ]: SHAPE_ROCK,
  [ SHAPE_SCISSORS ]: SHAPE_PAPER,
};

const FILTER_DATA_FOR_EVENTS = [ EVENT_PLAYER_CHOSE_SHAPE ];

class Player {
  constructor(events) {
    this.events = events;

    this.id = null;
    this.connection = null;
    this.status = null;
    this.shape = SHAPE_UNKNOWN;
    this.score = 0;
    this.lost = false;
  }

  register(id, connection) {
    if (this.connection) {
      this.connection.close();
      this.unsubscribe();
    }

    this.id = id;
    this.connection = connection;
    this.status = PLAYER_STATUS_CONNECTED;

    connection.id = id;

    this.subscribe();
  }

  handleEvents({ type, origin, data, local, remote }) {
    // if originated from current player
    if (local && ( this.id === origin || !origin )) {
      switch (type) {
        case EVENT_PLAYER_DISCONNECTED:
          this.unsubscribe();
          this.connection = null;
          this.status = PLAYER_STATUS_DISCONNECTED;
          break;

        case EVENT_PLAYER_CHOSE_SHAPE:
          if (this.shape === SHAPE_UNKNOWN && !this.lost) {
            const { shape } = data;
            this.shape = shape;
          }

          break;

        case EVENT_GAME_STATUS_CHANGED:
          if (data.status === GAME_STATUS_ROUND_FINISHED) {
            this.shape = SHAPE_UNKNOWN;
          }

          if (data.status === GAME_STATUS_GAME_FINISHED) {
            this.shape = SHAPE_UNKNOWN;
            this.lost = false;
          }

          break;

        // fired when there were 2 shapes selected (multiple players)
        case EVENT_ROUND_FINISHED:
          if (!this.lost && data.length === 2) {
            // filter out the shape of current player
            const opponentShape = data.filter(shape => shape !== this.shape)[0];

            // find out whether current player has lost or not
            const opponentWins = GAME_RULES[opponentShape] === this.shape;
            this.lost = opponentWins;
          } 

          if (this.shape === SHAPE_UNKNOWN && data.length > 0) {
            this.lost = true;
          }

          if (data.length === 0) {
            this.lost = false;
          }

          break;

        // fired when there is only one winning player left after the round end
        case EVENT_GAME_FINISHED:
          this.score += 1;

          break;
      };
    }

    // if originated from another player or remote is set to true
    if (remote && ( this.id === origin || !origin )) {
      console.log(`PLAYER ${this.id} GOT MESSAGE ${type}`)

      const message = JSON.stringify({
        type,
        data: FILTER_DATA_FOR_EVENTS.includes(type) ? { id: origin } : data,
      });

      // TODO: fix error
      // When single player connects than disconnects, server tries to send disconnect message to already disconnected player.
      // runner_1  | GAME - PLAYER DISCONNECTED 60762
      // runner_1  | PLAYER 60762 GOT MESSAGE event-player-disconnected
      // runner_1  | /app/src/libs/player.js:114
      // runner_1  |       this.connection.send(message);
      // runner_1  |                       ^
      // runner_1  | 
      // runner_1  | TypeError: Cannot read property 'send' of null
      // runner_1  |     at Player.handleEvents (/app/src/libs/player.js:114:23)
      // runner_1  |     at EventEmitter.emit (events.js:193:13)
      // runner_1  |     at emitRemotely (/app/src/libs/game.js:43:10)
      // runner_1  |     at Game.playerDisconnected (/app/src/libs/game.js:222:5)
      // runner_1  |     at handleClosedConnection (/app/src/ws/server.js:48:8)
      // runner_1  |     at WebSocket.connection.on (/app/src/ws/server.js:42:32)
      // runner_1  |     at WebSocket.emit (events.js:198:15)
      // runner_1  |     at WebSocket.emitClose (/app/node_modules/ws/lib/websocket.js:180:10)
      // runner_1  |     at Socket.socketOnClose (/app/node_modules/ws/lib/websocket.js:802:15)
      // runner_1  |     at Socket.emit (events.js:193:13)
      try {
        this.connection.send(message);
      } catch (e) {
        console.log('BIG FAT ERROR OCCURED, PLEASE DEBUG', e);
      }
    }
  }

  subscribe() {
    this.handleEvents = this.handleEvents.bind(this);

    this.events.on(EVENT_ACTION, this.handleEvents);
  }

  unsubscribe() {
    this.events.removeListener(EVENT_ACTION, this.handleEvents);
  }
}

module.exports = Player;
