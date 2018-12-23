import React from 'react';

const Context = React.createContext();

export class ContextProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: null,
      opponentNickname: null,
      runner: null,
    };
  }

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
          saveNickname: this.saveNickname,
          saveOpponentNickname: this.saveOpponentNickname,
          saveRunner: this.saveRunner,

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
