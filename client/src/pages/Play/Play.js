import React from 'react';
import { Grid, Header, Segment, Divider } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import './Play.css';

class Play extends React.Component {
  constructor() {
    super();

    this.state = {

    };
  }

  render() {
    console.log('context', this.props.context)
    const { nickname, opponentNickname, runner } = this.props.context;

        //{!runner ? <Redirect to="/" /> : null}
    return (
      <div>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column width={4}>
            <Segment stacked>
              <Header as="h2">You: { nickname }</Header>

              <Divider horizontal>VS</Divider>

              <Header as="h2">Opponent: { opponentNickname }</Header>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Play;
