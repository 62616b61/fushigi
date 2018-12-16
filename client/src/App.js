import React from 'react'
import { Route } from 'react-router-dom'

import Home from './pages/Home/Home'
import Play from './pages/Play/Play'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <Route
          path="/"
          component={Home}
          exact
        />

        <Route
          path="/play"
          component={Play}
          exact
        />
      </div>
    )
  }
}

