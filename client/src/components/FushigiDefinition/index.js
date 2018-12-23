import React from 'react';
import { Container, Grid } from 'semantic-ui-react';

import './styles.css';

export default () => {
  return (
    <Container className="fushigi">
      <Grid textAlign='left' centered>
        <Grid.Column className="term" width={4}>
          不思議
        </Grid.Column>
        <Grid.Column className="definition" width={8}>
          <span>Na-adjective, Noun</span>
          <p>1. wonderful; marvelous; strange; incredible; amazing; curious; miraculous; mysterious</p>
        </Grid.Column>
      </Grid>
    </Container>
  )
}
