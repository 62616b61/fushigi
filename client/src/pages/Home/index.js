import React, { useState, useEffect, useContext, useReducer } from 'react';
import { Button, Form, Grid, Segment, Dimmer, Loader } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import FushigiDefinition from '../../components/FushigiDefinition';
import useSocket from '../../hooks/useSocket';

import { AppContext } from '../../context/app';

import './home.module.css';

const STEP_IDLE = 0;
const STEP_LOOKING_FOR_OPPONENT = 1;
const STEP_CREATING_RUNNER = 2;
const STEP_READY = 3;

const MSG_TYPE_JOIN = 'join';
const MSG_TYPE_ASSIGNED_PLAYER_ID = 'assigned-player-id';
const MSG_TYPE_OPPONENT_FOUND = 'opponent-found';
const MSG_TYPE_RUNNER_READY = 'runner-ready';

const initialHomeState = {
  step: STEP_IDLE,
  playerId: null,
  runner: null,
};

function homeReducer (state, action) {
  const { type, data } = action;

  console.log('TPYPEP', type, data)

  switch (type) {
    case MSG_TYPE_JOIN: 
      return {
        ...state,
        step: STEP_LOOKING_FOR_OPPONENT,
      };

    case MSG_TYPE_ASSIGNED_PLAYER_ID:
      return {
        ...state,
        playerId: data.playerId,
      };

    case MSG_TYPE_OPPONENT_FOUND:
      return {
        ...state,
        step: STEP_CREATING_RUNNER,
      };

    case MSG_TYPE_RUNNER_READY:
      return {
        ...state,
        step: STEP_READY,
        runner: data.runner,
      };

    default:
      console.log('UNKNOWN ACTION TYPE');
  }
}

const Home = withRouter(({ history }) => {
  const {
    savePlayerId,
    saveNickname,
    saveRunner,
  } = useContext(AppContext);

  const [ nickname, setNickname ] = useState('');
  const [ home, dispatch ] = useReducer(homeReducer, initialHomeState);

  const { runner, playerId, step } = home;

  const { REACT_APP_RUNTIME, REACT_APP_HUB_URL } = process.env;
  const serverUrl = REACT_APP_RUNTIME === 'kubernetes' ? window.location.host : REACT_APP_HUB_URL;
  const socketUrl = `ws://${serverUrl}/ws`;

  const [isConnected, socket] = useSocket({
    name: 'Hub',
    url: socketUrl,
    dispatch,
  });

  const sendJoinMessage = () => {
    dispatch({ type: MSG_TYPE_JOIN })

    const message = JSON.stringify({
      type: MSG_TYPE_JOIN,
      data: { nickname },
    });

    socket.send(message);
  };

  useEffect(() => {
    if (step === STEP_READY) {
      saveNickname(nickname);
      savePlayerId(playerId);
      saveRunner(runner);

      history.push('/play/');
    }
  }, [step]);

  useEffect(() => {
    // automatically join a game if running in docker-compose
    if (REACT_APP_RUNTIME !== 'kubernetes' && isConnected) {
      setNickname('kek?');
      sendJoinMessage();
    };
  }, [isConnected]);

  return (
    <div>
      <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
        <Grid.Column width={4}>
          <FushigiDefinition />
          <Segment stacked>
            <Dimmer active={!isConnected}>
              <Loader>Connecting to server...</Loader>
            </Dimmer>

            <Dimmer active={step !== STEP_IDLE}>
              <Loader>
                {
                  step === STEP_LOOKING_FOR_OPPONENT
                    ? 'Looking for opponent...'
                    : 'Preparing your game...'
                }
              </Loader>
            </Dimmer>

            <Form size='large'>
              <p>Choose your nickname</p>
              <Form.Input
                fluid icon='user'
                iconPosition='left'
                placeholder='Nickname'
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />

              <Button
                fluid
                content='Find opponent'
                color='teal'
                size='large'
                onClick={sendJoinMessage}
              />
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
});

export default Home;
