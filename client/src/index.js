import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'

import { ContextProvider } from './context';
import App from './App';

import 'semantic-ui-css/semantic.min.css';
import './styles/index.css';


const Root = () => (
  <ContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ContextProvider>
)

ReactDOM.render(<Root />, document.getElementById('root'));
