import {
  EVENT_GAME_STATE,
  EVENT_GAME_STATUS_CHANGED,
  EVENT_GAME_COUNTDOWN,
  EVENT_PLAYER_AUTHENTICATED,
  EVENT_PLAYER_DISCONNECTED,
  EVENT_PLAYER_CHOSE_SHAPE,
} from '../libs/events';

import {
  Player,
  STATUS_DISCONNECTED,
  STATUS_CONNECTED,
  STATUS_CHOSE_SHAPE,
} from '../libs/player';

export const GAME_STATUS_IDLE = 'game-idle';
export const GAME_STATUS_WAITING = 'game-waiting';
export const GAME_STATUS_PLAYING = 'game-playing';
export const GAME_STATUS_ROUND_FINISHED = 'game-round-finished';
export const GAME_STATUS_GAME_FINISHED = 'game-game-finished';

export const initialGameState = {
  status: GAME_STATUS_IDLE,
  counter: null,
  players: [],
};

export function gameReducer (state, action) {
  const { players } = state;
  const { type, data } = action;
  const indexToUpdate = players.findIndex(player => player.id === data.id);

  switch (type) {
    case EVENT_GAME_STATE:
      return {
        status: data.status,
        players: data.players.map(player => new Player(player)),
      };

    case EVENT_GAME_STATUS_CHANGED:
      return {
        ...state,
        status: data.status,
      };

    case EVENT_GAME_COUNTDOWN:
      return {
        ...state,
        counter: data.counter,
      };

    case EVENT_PLAYER_AUTHENTICATED: 
      // if player has reconnected and already exists in state
      if (indexToUpdate !== -1) {
        return {
          ...state,
          players: players.map((player, index) => {
            // this is not the player that needs to be updated, keep looking
            if (index !== indexToUpdate) {
              return player;
            }

            return new Player({
              ...player,
              status: STATUS_CONNECTED,
            });
          }),
        };
      }

      // if connected player is new
      return {
        ...state,
        players: [
          ...players,
          new Player({
            ...action.data,
            status: STATUS_CONNECTED,
          }),
        ],
      };

    case EVENT_PLAYER_DISCONNECTED:
      return {
        ...state,
        players: players.map((player, index) => {
          // this is not the player that needs to be updated, keep looking
          if (index !== indexToUpdate) {
            return player;
          }

          return new Player({
            ...player,
            status: STATUS_DISCONNECTED,
          });
        }),
      };

    case EVENT_PLAYER_CHOSE_SHAPE:
      return {
        ...state,
        players: players.map((player, index) => {
          // this is not the player that needs to be updated, keep looking
          if (index !== indexToUpdate) {
            return player;
          }

          return new Player({
            ...player,
            status: STATUS_CHOSE_SHAPE,
          });
        }),
      };

    default:
      console.log('UNKNOWN ACTION TYPE');
  }
}
