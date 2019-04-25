import React, { useContext } from 'react';
import { Grid, Button, Container, Header, Segment, Divider, Dimmer, Loader, Label } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import { AppContext } from '../../context/app';
import { PlayContextProvider } from './context/play';

import GameStatus from './components/GameStatus';
import PlayerBoard from './components/PlayerBoard';
import BackButton from '../../components/BackButton';

function Play () {
  const { runner } = useContext(AppContext);

  return (
    <div>
      { !runner ? <Redirect to="/" /> : null }

      <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
        <Grid.Column style={{width: '700px'}}>
          <Segment.Group stacked>
            <GameStatus />
            <PlayerBoard />
            <Segment textAlign='center' secondary>
              <BackButton />
            </Segment>
          </Segment.Group>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default () => {
  return (
    <PlayContextProvider>
      <Play />
    </PlayContextProvider>
  );
};
