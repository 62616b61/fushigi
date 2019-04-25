import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'

import { AppContextProvider } from './context/app';
import App from './App';

import 'semantic-ui-css/semantic.min.css';
import './styles/index.css';

const Root = () => (
  <AppContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppContextProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
