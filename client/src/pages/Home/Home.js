import React from 'react';
import { Button, Form, Grid, Header, Segment, Dimmer, Loader } from 'semantic-ui-react';

import './Home.css';

const STEP_IDLE = 0;
const STEP_LOOKING_FOR_OPPONENT = 1;
const STEP_CREATING_RUNNER = 2;

class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      nickname: '',
      step: STEP_IDLE,
    };

    this.handleChange = this.handleChange.bind(this);
    this.findOpponent = this.findOpponent.bind(this);
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://192.168.99.100:31380/ws');

    this.socket.addEventListener('open', () => {
      console.log('SOCKET CONNECTION IS OPEN')
    });

    this.socket.addEventListener('message', (newMsg) => {

    });
  }

  componentWillUnmount() {
    if (!this.socket) return;

    try {
      this.socket.close();
    } catch (err) {
      console.log('Error in closing socket: ', err);
    }
  }

  handleChange(event) {
    this.setState({
      nickname: event.target.value
    });
  }

  findOpponent() {
    this.setState({
      step: STEP_LOOKING_FOR_OPPONENT,
    });

    console.log('CLICK', this.state)
  }

  render() {
    return (
      <div className="Home">
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column width={4}>
            <Segment stacked>
              <Dimmer active={this.state.step !== STEP_IDLE}>
                <Loader>Loading</Loader>
              </Dimmer>
              <Form size='large'>
                <p>Choose your nickname</p>
                <Form.Input fluid icon='user' iconPosition='left' placeholder='Nickname' value={this.state.nickname} onChange={this.handleChange} />

                <Button color='teal' fluid size='large' onClick={this.findOpponent}>
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
