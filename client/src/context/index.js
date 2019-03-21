import React, { useState } from 'react';

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

        playerId,
        nickname,
        opponentNickname,
        runner,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const ContextConsumer = Context.Consumer;
