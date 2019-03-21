import React from 'react';
import { Route } from 'react-router-dom';

import { ContextConsumer } from './context';
import Home from './pages/Home/Home';
import Play from './pages/Play/Play';

const App = () => {
  return (
    <div>
      <Route path="/" exact render={() => 
        <ContextConsumer>
          { (context) => <Home context={context} /> }
        </ContextConsumer>
      }/>

      <Route path="/play" exact render={() => 
        <ContextConsumer>
          { (context) => <Play context={context} /> }
        </ContextConsumer>
      }/>
    </div>
  );
};

export default App;
