import React from 'react';
import { Grid, Container, Header, Segment, Divider, Dimmer, Loader, Label } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import PlaySocket from '../../ws/PlaySocket';
import ShapeSelector from '../../components/Shapes/ShapeSelector';
import SelectedShape from '../../components/Shapes/SelectedShape';
import BackButton from '../../components/BackButton';
import Countdown from '../../components/Countdown';

import './Play.css';

const NICKNAME_PLACEHOLDER = 'You';
const OPPONENT_NICKNAME_PLACEHOLDER = 'Opponent';

const STEP_CONNECTING = 0;
const STEP_WAITING_FOR_OPPONENT = 1;
const STEP_CHOOSING_SHAPES = 2;
const STEP_DISPLAYING_RESULTS = 3;

class Play extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: STEP_CONNECTING,
      opponentLeft: false,
      opponentChoseShape: false,
      selectedShape: null,
      opponentShape: null,
      score: [0, 0],
    };
  }

  componentDidMount() {
    const { runner } = this.props.context;

    if (!runner) return;

    const onOpen = () => {
      console.log('Runner socket connection is open.')

      this.setState({
        step: STEP_WAITING_FOR_OPPONENT,
      });

      const { playerId } = this.props.context;
      this.socket.sendPlayerAuthMessage({
        playerId,
      });
    };

    const onOpponentJoined = () => {
      this.setState({
        step: STEP_CHOOSING_SHAPES,
      });
    };

    const onOpponentLeft = () => {
      this.setState({
        opponentLeft: true,
      });

      this.socket.disconnect();
    };

    const onOpponentChose = () => {
      this.setState({
        opponentChoseShape: true,
      });
    };

    const onResults = (data) => {
      this.setState({
        step: STEP_DISPLAYING_RESULTS,
        opponentShape: data.opponentShape,
        score: data.score,
      });
    };

    this.socket = new PlaySocket({
      runner,
      onOpen,
      onOpponentJoined,
      onOpponentLeft,
      onOpponentChose,
      onResults,
    });
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  selectShape = (shape) => {
    if (!this.state.selectedShape) {
      this.setState({
        selectedShape: shape,
      });
    }

    this.socket.sendChooseShapeMessage({ shape });
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
