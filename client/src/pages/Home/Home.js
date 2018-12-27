import React from 'react';
import { Button, Form, Grid, Header, Segment, Dimmer, Loader } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import HubSocket from '../../ws/HubSocket';

import FushigiDefinition from '../../components/FushigiDefinition';

import './Home.css';

const STEP_IDLE = 0;
const STEP_LOOKING_FOR_OPPONENT = 1;
const STEP_CREATING_RUNNER = 2;
const STEP_READY = 3;

class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      nickname: '',
      step: STEP_IDLE,
    };
  }

  componentDidMount() {
    const onAssignedPlayerId = (data) => {
      this.props.context.savePlayerId(data.playerId);
    };

    const onOpponentFound = (data) => {
      this.props.context.saveOpponentNickname(data.opponentNickname);

      this.setState({
        step: STEP_CREATING_RUNNER,
      });
    };

    const onRunnerReady = (data) => {
      this.props.context.saveRunner(data.runner);

      this.setState({
        step: STEP_READY,
      });
    };

    this.socket = new HubSocket({
      onAssignedPlayerId,
      onOpponentFound,
      onRunnerReady,
    });
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  handleInput = (event) => {
    this.setState({
      nickname: event.target.value,
    });
  }

  sendJoinMessage = () => {
    this.props.context.saveNickname(this.state.nickname);

    this.setState({
      step: STEP_LOOKING_FOR_OPPONENT,
    });

    this.socket.sendJoinMessage({ nickname: this.state.nickname });
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
                <Loader>
                  {
                    this.state.step === STEP_LOOKING_FOR_OPPONENT
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
                  value={this.state.nickname}
                  onChange={this.handleInput}
                />

                <Button
                  fluid
                  content='Find opponent'
                  color='teal'
                  size='large'
                  onClick={this.sendJoinMessage}
                />
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Home;
