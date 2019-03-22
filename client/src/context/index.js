import React, { useState } from 'react';
import getRandomInt from '../libs/random';
const { REACT_APP_RUNTIME } = process.env;

const Context = React.createContext();

export function ContextProvider({ children }) {
  const [ playerId, savePlayerId ] = useState(null);
  const [ nickname, saveNickname ] = useState(null);
  const [ opponentNickname, saveOpponentNickname ] = useState(null);
  const [ runner, saveRunner ] = useState(null);

  return (
    <Context.Provider
      value={{
        savePlayerId,
        saveNickname,
        saveOpponentNickname,
        saveRunner,

        playerId: REACT_APP_RUNTIME === 'docker-compose' ? getRandomInt() : playerId,
        nickname,
        opponentNickname,
        runner: REACT_APP_RUNTIME === 'docker-compose' ? getRandomInt() : runner,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const ContextConsumer = Context.Consumer;
