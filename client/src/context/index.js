import React from 'react';

export const Context = React.createContext();

export class ContextProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      runner: null,
    };
  }

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
          saveRunner: this.saveRunner,
          runner: this.state.runner,
        }}
      >
        {children}
      </Context.Provider>
    );
  }
}

export const ContextConsumer = Context.Consumer;
