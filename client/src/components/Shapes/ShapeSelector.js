import React from 'react';
import { Button }  from 'semantic-ui-react';
import { ROCK, PAPER, SCISSORS, SHAPE_TO_ICON } from '../../libs/shapes';

const shapes = [ROCK, PAPER, SCISSORS];

const ShapeSelector = ({onClick, selectedShape}) => {
  const buttons = shapes.map(shape => {
    return <Button
      key={shape}
      color='teal'
      size='huge'
      icon={'hand outline ' + SHAPE_TO_ICON[shape]}
      active={selectedShape === shape}
      disabled={selectedShape && selectedShape !== shape}
      onClick={() => onClick(shape)}
    />
  });

  return (
    <Button.Group vertical>
      { buttons }
    </Button.Group>
  );
};

export default ShapeSelector;
