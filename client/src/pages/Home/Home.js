import React, { Component } from 'react';
import { client } from '../../ws/client';
import './Home.css';

class Home extends Component {
  render() {



    return (
      <div className="Home">
        <header className="Home-header">
          <p>
            FUSHIGI
          </p>
        </header>
      </div>
    );
  }
}

export default Home;
