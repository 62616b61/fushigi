import React, { useState } from 'react';
import { Grid, Container, Header, Segment, Divider, Dimmer, Loader, Label } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import ShapeSelector from '../../components/Shapes/ShapeSelector';
import SelectedShape from '../../components/Shapes/SelectedShape';
import BackButton from '../../components/BackButton';
import Countdown from '../../components/Countdown';
import useSocket from '../../hooks/useSocket';

import './Play.css';

const NICKNAME_PLACEHOLDER = 'You';
const OPPONENT_NICKNAME_PLACEHOLDER = 'Opponent';

const STEP_CONNECTING = 0;
const STEP_WAITING_FOR_OPPONENT = 1;
const STEP_CHOOSING_SHAPES = 2;
const STEP_DISPLAYING_RESULTS = 3;

const MSG_TYPE_PLAYER_AUTH = 'player-auth';
const MSG_TYPE_OPPONENT_JOINED = 'opponent-joined';
const MSG_TYPE_OPPONENT_LEFT = 'opponent-left';
const MSG_TYPE_CHOOSE_SHAPE = 'choose-shape';
const MSG_TYPE_OPPONENT_CHOSE = 'opponent-chose';
const MSG_TYPE_RESULTS = 'results';

function Play ({context}) {
  const [ step, setStep ] = useState(STEP_CONNECTING);
  const [ opponentLeft, setOpponentLeft ] = useState(false);
  const [ opponentChoseShape, setOpponentChoseShape ] = useState(false);
  const [ selectedShape, setSelectedShape ] = useState(null);
  const [ opponentShape, setOpponentShape ] = useState(null);
  const [ score, setScore ] = useState([0, 0]);

  const {
    nickname,
    playerId,
    opponentNickname,
    runner,
  } = context;

  const [isConnected, socket] = useSocket({
    name: 'Runner',
    wsUrl: `runner/${runner}`,
    handlers: {
      [ MSG_TYPE_OPPONENT_JOINED ]: () => {
        setStep(STEP_CHOOSING_SHAPES);
      },

      [ MSG_TYPE_OPPONENT_LEFT ]: ({ socket }) => {
        setOpponentLeft(true);
        socket.close();
      },

      [ MSG_TYPE_OPPONENT_CHOSE ]: () => {
        setOpponentChoseShape(true);
      },

      [ MSG_TYPE_RESULTS ]: ({ data }) => {
        setStep(STEP_DISPLAYING_RESULTS);
        setOpponentShape(data.opponentShape);
        setScore(data.score);
      },
    },
  });

  if (isConnected && step === STEP_CONNECTING) {
    setStep(STEP_WAITING_FOR_OPPONENT);

    const message = JSON.stringify({
      type: MSG_TYPE_PLAYER_AUTH,
      data: { playerId },
    });

    socket.send(message);
  }

  const selectShape = (shape) => {
    if (!selectedShape) {
      setSelectedShape(shape);
    }

    const message = JSON.stringify({
      type: MSG_TYPE_CHOOSE_SHAPE,
      data: { shape },
    });

    socket.send(message);
  };

  const startNewRound = () => {
    setStep(STEP_CHOOSING_SHAPES);
    setOpponentChoseShape(false);
    setSelectedShape(null);
    setOpponentShape(null);
  };

  const opponentChoosingOrWaiting = (
    <p>{opponentChoseShape ? 'Opponent is waiting for you.' : 'Opponent is thinking...'}</p>
  );

  return (
    <div>
      { !runner ? <Redirect to="/play" /> : null }
      <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
        <Grid.Column style={{width: '700px'}}>
          <Segment.Group stacked>
            <Segment>
              <Grid columns={2} padded>
                <Grid.Column>
                  <Header as='h2'>{ nickname ? nickname : NICKNAME_PLACEHOLDER }</Header>
                </Grid.Column>

                <Grid.Column >
                  <Header as='h2'>{ opponentNickname ? opponentNickname : OPPONENT_NICKNAME_PLACEHOLDER }</Header>
                </Grid.Column>
              </Grid>

              <Grid columns={2} padded>
                <Grid.Column>
                  <Label content={score[0]} color='grey' />
                </Grid.Column>

                <Grid.Column >
                  <Label content={score[1]} color='grey' />
                </Grid.Column>
              </Grid>

              <Divider vertical>VS</Divider>
            </Segment>
            <Segment>
              <Dimmer active={step < STEP_CHOOSING_SHAPES}>
                <Loader>{
                  step === STEP_CONNECTING
                    ? 'Connecting to the game...'
                    : 'Waiting for opponent...'
                }</Loader>
              </Dimmer>

              <Grid columns={opponentLeft ? 1 : 2} style={{height: '300px'}} verticalAlign='middle'>
                {
                  opponentLeft ? (
                      <Grid.Column>
                        <Header as='h3'>Opponent has left the game.</Header>
                        <BackButton text='Return to main menu' />
                      </Grid.Column>
                  ) : (
                    <React.Fragment>
                      <Grid.Column>
                          {
                            step <= STEP_CHOOSING_SHAPES
                              ? <ShapeSelector selectedShape={selectedShape} onClick={selectShape} />
                              : <SelectedShape shape={selectedShape} opponentShape={opponentShape} player />
                          }
                        </Grid.Column>
                        <Grid.Column>
                          {
                            step <= STEP_CHOOSING_SHAPES
                              ? opponentChoosingOrWaiting
                              : <SelectedShape shape={opponentShape} opponentShape={selectedShape} />
                          }
                        </Grid.Column>
                    </React.Fragment>
                  )
                }
              </Grid>
              {
                !opponentLeft ? (
                  <Divider vertical>
                    <Container textAlign='center' style={{width: '100px'}}>
                      {
                        step <= STEP_CHOOSING_SHAPES
                          ? 'CHOOSE'
                          : <Countdown seconds={3} onFinish={startNewRound} />
                      }
                    </Container>
                  </Divider>
                ) : null
              }
            </Segment>
            <Segment textAlign='left' secondary>
              <BackButton />
            </Segment>
          </Segment.Group>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default Play;
