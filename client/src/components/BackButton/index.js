import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

const BackButton = withRouter(({ history }) => (
  <Button
    size='tiny'
    icon='left arrow'
    labelPosition='left'
    content='Main menu'
    onClick={() => { history.push('/') }}
  />
));

export default BackButton;
