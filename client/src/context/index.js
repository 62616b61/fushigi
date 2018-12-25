import React from 'react';

const Context = React.createContext();

export class ContextProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerId: null,
      nickname: null,
      opponentNickname: null,
      runner: null,
    };
  }

  savePlayerId = (id) => {
    this.setState({
      playerId: id,
    });
  };

  saveNickname = (nickname) => {
    this.setState({
      nickname,
    });
  };

  saveOpponentNickname = (nickname) => {
    this.setState({
      opponentNickname: nickname,
    });
  };

  saveRunner = (runner) => {
    this.setState({
      runner,
    });
  };

  render() {
    const { children } = this.props;

    return (
      <Context.Provider
        value={{
          savePlayerId: this.savePlayerId,
          saveNickname: this.saveNickname,
          saveOpponentNickname: this.saveOpponentNickname,
          saveRunner: this.saveRunner,

          playerId: this.state.playerId,
          nickname: this.state.nickname,
          opponentNickname: this.state.opponentNickname,
          runner: this.state.runner,
        }}
      >
        {children}
      </Context.Provider>
    );
  }
}

export const ContextConsumer = Context.Consumer;
