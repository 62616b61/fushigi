import React, { useState } from 'react';
import { Button, Form, Grid, Segment, Dimmer, Loader } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import FushigiDefinition from '../../components/FushigiDefinition';
import useSocket from '../../hooks/useSocket';

import './Home.css';

const STEP_IDLE = 0;
const STEP_LOOKING_FOR_OPPONENT = 1;
const STEP_CREATING_RUNNER = 2;
const STEP_READY = 3;

const MSG_TYPE_JOIN = 'join';
const MSG_TYPE_ASSIGNED_PLAYER_ID = 'assigned-player-id';
const MSG_TYPE_OPPONENT_FOUND = 'opponent-found';
const MSG_TYPE_RUNNER_READY = 'runner-ready';

function Home ({ context }) {
  const [ nickname, setNickname ] = useState('');
  const [ step, setStep ] = useState(STEP_IDLE);

  const [isConnected, socket] = useSocket({
    name: 'Hub',
    wsUrl: 'ws',
    handlers: {
      [MSG_TYPE_ASSIGNED_PLAYER_ID]: ({ data }) => {
        context.savePlayerId(data.playerId);
      },

      [MSG_TYPE_OPPONENT_FOUND]: ({ data }) => {
        context.saveOpponentNickname(data.opponentNickname);
        setStep(STEP_CREATING_RUNNER);
      },

      [MSG_TYPE_RUNNER_READY]: ({ data }) => {
        context.saveRunner(data.runner);
        setStep(STEP_READY);
      },
    },
  });

  const sendJoinMessage = () => {
    context.saveNickname(nickname);

    setStep(STEP_LOOKING_FOR_OPPONENT)

    const message = JSON.stringify({
      type: MSG_TYPE_JOIN,
      data: { nickname },
    });

    socket.send(message);
  };

  return (
    <div>
      {step === STEP_READY ? <Redirect push to="/play" /> : null}
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
}

export default Home;
