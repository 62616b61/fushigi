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
    const { runner } = this.props.context;

    return (
      <div>

        {!runner ? <Redirect to="/" /> : null}

        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column width={4}>
            <Segment stacked>
              <Header as="h2">You</Header>

              <Divider horizontal>VS</Divider>

              <Header as="h2">Opponent</Header>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Play;
