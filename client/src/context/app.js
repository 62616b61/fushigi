import React, { useState } from 'react';
//import getRandomInt from '../libs/random';
//const { REACT_APP_RUNTIME } = process.env;

export const AppContext = React.createContext();

//const storage = window.localStorage;

//function getPlayerIdFromLocalStorage() {
  //const playerId = storage.getItem('playerId')
  //if (playerId) {
    //return playerId;
  //}

  //return generateNewPlayerIdAndSaveToLocalStorage();
//}

//function generateNewPlayerIdAndSaveToLocalStorage() {
  //const playerId = getRandomInt();

  //storage.setItem('playerId', playerId);

  //return playerId;
//}

export function AppContextProvider({ children }) {
  const [ playerId, savePlayerId ] = useState(null);
  const [ nickname, saveNickname ] = useState(null);
  const [ runner, saveRunner ] = useState(null);

  return (
    <AppContext.Provider
      value={{
        savePlayerId,
        saveNickname,
        saveRunner,

        //playerId: (REACT_APP_RUNTIME === 'docker-compose' && !playerId) ? getPlayerIdFromLocalStorage() : playerId,
        playerId,
        nickname,
        runner,
        //runner: (REACT_APP_RUNTIME === 'docker-compose' && !runner) ? getRandomInt() : runner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
