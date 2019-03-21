import React, { useState } from 'react';

const Context = React.createContext();

export function ContextProvider({ children }) {
  const [ playerId, savePlayerId ] = useState(null);
  const [ nickname, saveNickname ] = useState(null);
  const [ opponentNickname, saveOpponentNickname ] = useState(null);

  return (
    <Context.Provider
      value={{
        savePlayerId,
        saveNickname,
        saveOpponentNickname,

        playerId,
        nickname,
        opponentNickname,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const ContextConsumer = Context.Consumer;
