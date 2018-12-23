import React from 'react';
import { Button, Form, Grid, Header, Segment, Dimmer, Loader } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import FushigiDefinition from '../../components/FushigiDefinition';

import './Home.css';

const STEP_IDLE = 0;
const STEP_LOOKING_FOR_OPPONENT = 1;
const STEP_CREATING_RUNNER = 2;
const STEP_READY = 3;

const MSG_TYPE_JOIN = 'join';
const MSG_TYPE_OPPONENT_FOUND = 'opponent-found';
const MSG_TYPE_RUNNER_READY = 'runner-ready';

class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      nickname: '',
      step: STEP_IDLE,
    };

    this.handleChange = this.handleChange.bind(this);
    this.sendJoinMessage = this.sendJoinMessage.bind(this);
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://192.168.99.100:31380/ws');

    this.socket.addEventListener('open', () => {
      console.log('Hub socket connection is open.')
    });

    this.socket.addEventListener('message', message => this.handleMessage(message.data));
  }

  componentWillUnmount() {
    if (!this.socket) return;

    try {
      this.socket.close();
      console.log('Hub socket connection has been closed.')
    } catch (err) {
      console.log('Error closing socket:', err);
    }
  }

  handleMessage(data) {
    const message = JSON.parse(data);

    if (message.type === MSG_TYPE_OPPONENT_FOUND) {
      this.setState({
        step: STEP_CREATING_RUNNER,
      });
    }

    if (message.type === MSG_TYPE_RUNNER_READY) {
      this.setState({
        step: STEP_READY,
      });

      this.props.context.saveRunner(message.runner);
    }
  }

  handleChange(event) {
    this.setState({
      nickname: event.target.value,
    });
  }

  sendJoinMessage() {
    this.setState({
      step: STEP_LOOKING_FOR_OPPONENT,
    });

    const joinMessage = JSON.stringify({
      type: MSG_TYPE_JOIN,
      nickname: this.state.nickname,
    });

    this.socket.send(joinMessage);
  }

  render() {
    return (
      <div>

        {this.state.step === STEP_READY ? <Redirect push to="/play" /> : null}

        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column width={4}>
            <FushigiDefinition />
            <Segment stacked>
              <Dimmer active={this.state.step !== STEP_IDLE}>
                <Loader>{this.state.step === STEP_LOOKING_FOR_OPPONENT ? 'Looking for opponent...' : 'Preparing your game...'}</Loader>
              </Dimmer>

              <Form size='large'>
                <p>Choose your nickname</p>
                <Form.Input fluid icon='user' iconPosition='left' placeholder='Nickname' value={this.state.nickname} onChange={this.handleChange} />

                <Button color='teal' fluid size='large' onClick={this.sendJoinMessage}>
                  Find opponent
                </Button>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Home;
