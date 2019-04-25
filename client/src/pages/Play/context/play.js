import React, { useEffect, useContext, useReducer } from 'react';

import { AppContext } from '../../../context/app';
import useSocket from '../../../hooks/useSocket';
import { gameReducer, initialGameState } from '../libs/game';
import {
  EVENT_PLAYER_AUTHENTICATED,
  EVENT_PLAYER_CHOSE_SHAPE,
} from '../libs/events';

export const PlayContext = React.createContext();

export function PlayContextProvider({ children }) {
  const { runner, playerId } = useContext(AppContext);

  const [ game, dispatch ] = useReducer(gameReducer, initialGameState);

  const { REACT_APP_RUNTIME, REACT_APP_RUNNER_URL } = process.env;
  const serverUrl = REACT_APP_RUNTIME === 'kubernetes' ? window.location.host : REACT_APP_RUNNER_URL;
  const socketUrl = `ws://${serverUrl}/runner/${runner}`;

  const [isConnected, socket] = useSocket({
    name: 'Runner',
    url: socketUrl,
    dispatch,
  });

  // Send authorization message
  useEffect(() => {
    if (isConnected) {
      const message = JSON.stringify({
        type: EVENT_PLAYER_AUTHENTICATED,
        data: { id: playerId },
      });

      socket.send(message);
    }
  }, [isConnected]);

  const selectShape = (shape) => {
    const message = JSON.stringify({
      type: EVENT_PLAYER_CHOSE_SHAPE,
      data: { shape },
    });

    socket.send(message);
  };

  const myself = game.players.find(player => player.id === playerId);
  const others = game.players.filter(player => player.id !== playerId);

  return (
    <PlayContext.Provider
      value={{
        isConnected,
        selectShape,

        status: game.status,
        counter: game.counter,

        myself,
        others,
      }
    }>
      {children}
    </PlayContext.Provider>
  );
}
