import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

const BackButton = withRouter(({ history, text }) => (
  <Button
    size='tiny'
    icon='left arrow'
    labelPosition='left'
    content={ text ? text : 'Main menu'}
    onClick={() => { history.push('/') }}
  />
));

export default BackButton;
