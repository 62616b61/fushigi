import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Play from './pages/Play';

const App = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/play" exact component={Play} />
    </Switch>
  );
};

export default App;
