import React, { useState, useContext } from 'react';
import { Button }  from 'semantic-ui-react';

import { UNKNOWN, ROCK, PAPER, SCISSORS, SHAPE_TO_ICON } from '../../libs/shapes';
import { PlayContext } from '../../context/play';

const shapes = [ROCK, PAPER, SCISSORS];

const ShapeSelector = () => {
  const { selectShape } = useContext(PlayContext);
  const [ selectedShape, setSelectedShape ] = useState(UNKNOWN);

  const hasSelected = selectedShape !== UNKNOWN;

  function handleClick(shape) {
    selectShape(shape);
    setSelectedShape(shape);
  }

  const buttons = shapes.map(shape => {
    return <Button
      key={shape}
      color='teal'
      size='huge'
      icon={'hand outline ' + SHAPE_TO_ICON[shape]}
      active={selectedShape === shape}
      disabled={hasSelected && selectedShape !== shape}
      onClick={() => handleClick(shape)}
    />
  });

  return (
    <Button.Group vertical>
      { buttons }
    </Button.Group>
  );
};

export default ShapeSelector;
