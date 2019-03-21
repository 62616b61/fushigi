import React, { useState } from 'react';
import { Button, Form, Grid, Segment, Divider, Dimmer, Loader } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import FushigiDefinition from '../../components/FushigiDefinition';
import useSocket from '../../hooks/useSocket';

import './Home.css';

const STEP_IDLE = 0;
const STEP_LOOKING_FOR_OPPONENT = 1;
const STEP_CREATING_RUNNER = 2;
const STEP_READY = 3;

const MSG_TYPE_JOIN = 'join';
const MSG_TYPE_CREATE_ROOM = 'create-room';

const MSG_TYPE_ASSIGNED_PLAYER_ID = 'assigned-player-id';
const MSG_TYPE_OPPONENT_FOUND = 'opponent-found';
const MSG_TYPE_RUNNER_READY = 'runner-ready';
const MSG_TYPE_ROOM_READY = 'room-ready';

function Home ({ context }) {
  const [ nickname, setNickname ] = useState('');
  const [ step, setStep ] = useState(STEP_IDLE);
  const [ runner, setRunner ] = useState(null);
  const [ room, setRoom ] = useState(null);

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
        setRunner(data.runner);
        setStep(STEP_READY);
      },

      [MSG_TYPE_ROOM_READY]: ({ data }) => {
        setRoom(data.room);
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

  const sendRoomRequestMessage = () => {
    const message = JSON.stringify({
      type: MSG_TYPE_CREATE_ROOM,
    });

    socket.send(message);
  };

  return (
    <div>
      {step === STEP_READY ? <Redirect push to={`/play/${runner}`} /> : null}

      <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
        <Grid.Column width={4} style={{minWidth: '700px' }}>
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

            <Grid columns={2} style={{height: '250px'}} verticalAlign='middle'>
              <Grid.Column>
                <Form style={{width: '250px', margin: 'auto'}}>
                  <Form.Input
                    fluid
                    icon='user'
                    iconPosition='left'
                    placeholder='Nickname'
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />

                  <Button
                    fluid
                    content='Find opponent'
                    color='teal'
                    size='small'
                    onClick={sendJoinMessage}
                  />
                </Form>
              </Grid.Column>
              <Grid.Column>
                <Form style={{width: '250px', margin: 'auto'}}>
                  {
                    room ? (
                      <Form.Input
                        fluid
                        icon='user'
                        iconPosition='left'
                        value={`${window.location.href}play/${room}`}
                      />
                    ) : null
                  }

                  {
                    room ? (
                      <Button
                        fluid
                        content='Join'
                        color='teal'
                        size='small'
                      />
                    ) : (
                      <Button
                        fluid
                        content='Create private room'
                        color='teal'
                        size='small'
                        onClick={sendRoomRequestMessage}
                      />
                    )
                  }

                </Form>
              </Grid.Column>
            </Grid>

            <Divider vertical>OR</Divider>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default Home;
