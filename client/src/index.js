import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'

import App from './App';

import 'semantic-ui-css/semantic.min.css'
import './styles/index.css';

const Root = () => (
  <div>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </div>
)

ReactDOM.render(<Root />, document.getElementById('root'));
