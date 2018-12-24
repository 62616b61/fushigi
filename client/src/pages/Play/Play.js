import React from 'react';
import { Button, Container, Grid, Header, Segment, Divider, Dimmer, Loader } from 'semantic-ui-react';
import { Redirect, withRouter } from 'react-router-dom';

import './Play.css';

const CONNECTION_PERIOD = 1000;

const NICKNAME_PLACEHOLDER = 'You';
const OPPONENT_NICKNAME_PLACEHOLDER = 'Opponent';

const STEP_CONNECTING = 0;
const STEP_WAITING = 1;
const STEP_PLAYING = 2;

const MSG_TYPE_OPPONENT_JOINED = 'opponent-joined';
const MSG_TYPE_OPPONENT_LEFT = 'opponent-left';

const BackButton = withRouter(({ history }) => (
  <Button
    icon='left arrow'
    labelPosition='left'
    content='Main menu'
    onClick={() => { history.push('/') }}
  />
));

class Play extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: STEP_CONNECTING,
    };
  }

  componentDidMount() {
    this.connectToRunner();
  }

  componentWillUnmount() {
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
      this.setState({ step: STEP_WAITING });
    });

    this.socket.addEventListener('message', message => this.handleMessage(message.data));

    this.socket.addEventListener('error', () => {
      console.log('Retrying in', CONNECTION_PERIOD);
      setTimeout(() => this.connectToRunner(), CONNECTION_PERIOD);
    });
  }

  handleMessage(data) {
    const message = JSON.parse(data);
    console.log('Incoming message', message)

    if (message.type === MSG_TYPE_OPPONENT_JOINED) {
      this.setState({
        step: STEP_PLAYING,
      });
    }
  }

  render() {
    const {
      nickname,
      opponentNickname,
      runner,
    } = this.props.context;

    return (
      <div>
        { !runner ? <Redirect to="/" /> : null }
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column width={4}>
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
                <Dimmer active={this.state.step !== STEP_PLAYING}>
                  <Loader>{this.state.step === STEP_CONNECTING ? 'Connecting to the game...' : 'Waiting for opponent...'}</Loader>
                </Dimmer>

                <Grid style={{height: '300px'}} columns={2} padded celled='internally'>
                  <Grid.Column verticalAlign='middle'>
                    <p>Rock Paper Scrissors</p>
                  </Grid.Column>
                  <Grid.Column verticalAlign='middle'>
                    <p>Opponent is thinking...</p>
                  </Grid.Column>
                </Grid>
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
