import React from 'react';
import { Grid, Header, Segment, Divider, Dimmer, Loader } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import { ShapeSelector, SelectedShape } from '../../components/Shapes';
import BackButton from '../../components/BackButton';

import './Play.css';

const CONNECTION_PERIOD = 1000;

const NICKNAME_PLACEHOLDER = 'You';
const OPPONENT_NICKNAME_PLACEHOLDER = 'Opponent';

const STEP_CONNECTING = 0;
const STEP_WAITING_FOR_OPPONENT = 1;
const STEP_CHOOSING_SHAPES = 2;
const STEP_DISPLAYING_RESULTS = 3;

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
      selectedShape: null,
      opponentShape: null,
    };
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
  }

  selectShape = (shape) => {
    if (!this.state.selectedShape) {
      this.setState({ selectedShape: shape });
    }
  };

  render() {
    const {
      nickname,
      opponentNickname,
      runner,
    } = this.props.context;

    const {
      step,
      selectedShape,
      opponentShape,
    } = this.state;

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

                <Divider vertical>VS</Divider>
              </Segment>
              <Segment>
                <Dimmer active={this.state.step < STEP_CHOOSING_SHAPES}>
                  <Loader>{this.state.step === STEP_CONNECTING ? 'Connecting to the game...' : 'Waiting for opponent...'}</Loader>
                </Dimmer>

                <Grid style={{height: '300px'}} columns={2} padded>
                  <Grid.Column verticalAlign='middle'>
                    {
                      step <= STEP_CHOOSING_SHAPES
                        ? <ShapeSelector selectedShape={selectedShape} onClick={this.selectShape} />
                        : <SelectedShape shape={selectedShape} opponentShape={opponentShape} player />
                    }
                  </Grid.Column>
                  <Grid.Column verticalAlign='middle'>
                    {
                      step <= STEP_CHOOSING_SHAPES
                        ? <p>Opponent is thinking...</p>
                        : <SelectedShape shape={opponentShape} opponentShape={selectedShape} />
                    }
                  </Grid.Column>
                </Grid>

                <Divider vertical>Choose</Divider>
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
