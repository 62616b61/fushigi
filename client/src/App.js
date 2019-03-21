import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { ContextConsumer, ContextProvider } from './context';
import Home from './pages/Home/Home';
import Play from './pages/Play/Play';

const App = () => {
  return (
    <ContextProvider>
        <ContextConsumer>
          { 
            (context) => <Switch>
              <Route
                exact
                path="/"
                render={() => <Home context={context} />}
              />

              <Route
                path="/play/:runner"
                exact
                render={({ match }) => <Play match={match} context={context} />}
              />
            </Switch>
          }
        </ContextConsumer>
    </ContextProvider>
  );
};

export default App;
