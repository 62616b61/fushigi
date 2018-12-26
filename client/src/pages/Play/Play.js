import React from 'react';
import { Grid, Container, Header, Segment, Divider, Dimmer, Loader, Label } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import ShapeSelector from '../../components/Shapes/ShapeSelector';
import SelectedShape from '../../components/Shapes/SelectedShape';
import BackButton from '../../components/BackButton';
import Countdown from '../../components/Countdown';

import './Play.css';

const CONNECTION_PERIOD = 1000;

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

class Play extends React.Component {
  constructor(props) {
    super(props);

    this.isActivePage = true;
    this.state = {
      step: STEP_CONNECTING,
      opponentLeft: false,
      opponentChoseShape: false,
      selectedShape: null,
      opponentShape: null,
      score: [0, 0],
    };

    this.sendPlayerAuthMessage = this.sendPlayerAuthMessage.bind(this);
  }

  componentDidMount() {
    this.connectToRunner();
  }

  componentWillUnmount() {
    this.isActivePage = false;
    if (!this.socket) return;

    try {
      this.socket.close();
      console.log('Runner socket connection has been closed.')
    } catch (err) {
      console.log('Error closing socket:', err);
    }
  }

  connectToRunner() {
    const { runner } = this.props.context;
    this.socket = new WebSocket(`ws://192.168.99.100:31380/runner/${runner}`);

    this.socket.addEventListener('open', () => {
      console.log('Runner socket connection is open.')
      this.setState({ step: STEP_WAITING_FOR_OPPONENT });
      this.sendPlayerAuthMessage();
    });

    this.socket.addEventListener('message', message => this.handleMessage(message.data));

    this.socket.addEventListener('error', () => {
      console.log('Retrying in', CONNECTION_PERIOD);
      if (this.isActivePage) {
        setTimeout(() => this.connectToRunner(), CONNECTION_PERIOD);
      }
    });
  }

  handleMessage(data) {
    const message = JSON.parse(data);
    console.log('Incoming message', message)

    if (message.type === MSG_TYPE_OPPONENT_JOINED) {
      this.setState({
        step: STEP_CHOOSING_SHAPES,
      });
    }

    if (message.type === MSG_TYPE_OPPONENT_LEFT) {
      this.setState({
        opponentLeft: true,
      });
    }

    if (message.type === MSG_TYPE_OPPONENT_CHOSE) {
      this.setState({
        opponentChoseShape: true,
      });
    }

    if (message.type === MSG_TYPE_RESULTS) {
      this.setState({
        step: STEP_DISPLAYING_RESULTS,
        opponentShape: message.opponentShape,
        score: message.score,
      });
    }
  }

  sendPlayerAuthMessage() {
    const message = JSON.stringify({
      type: MSG_TYPE_PLAYER_AUTH,
      playerId: this.props.context.playerId,
    });

    this.socket.send(message);
  }

  sendChooseShapeMessage(shape) {
    const message = JSON.stringify({
      type: MSG_TYPE_CHOOSE_SHAPE,
      shape,
    });

    this.socket.send(message);
  }

  selectShape = (shape) => {
    if (!this.state.selectedShape) {
      this.setState({ selectedShape: shape });
    }

    this.sendChooseShapeMessage(shape);
  };

  startNewRound = () => {
    this.setState({
      step: STEP_CHOOSING_SHAPES,
      opponentChoseShape: false,
      selectedShape: null,
      opponentShape: null,
    });
  }

  render() {
    const {
      nickname,
      opponentNickname,
      runner,
    } = this.props.context;

    const {
      step,
      opponentLeft,
      opponentChoseShape,
      selectedShape,
      opponentShape,
      score,
    } = this.state;

    const opponentChoosingOrWaiting = (
      <p>{opponentChoseShape ? 'Opponent is waiting for you.' : 'Opponent is thinking...'}</p>
    )

    return (
      <div>
        { !runner ? <Redirect to="/" /> : null }
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
                <Dimmer active={this.state.step < STEP_CHOOSING_SHAPES}>
                  <Loader>{this.state.step === STEP_CONNECTING ? 'Connecting to the game...' : 'Waiting for opponent...'}</Loader>
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
                                ? <ShapeSelector selectedShape={selectedShape} onClick={this.selectShape} />
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
                            : <Countdown seconds={3} onFinish={this.startNewRound} />
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
}

export default Play;
