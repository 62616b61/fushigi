import React from 'react';
import { Button }  from 'semantic-ui-react';
import { ROCK, PAPER, SCISSORS, SHAPE_TO_ICON } from '../../libs/shapes';
import { RULES } from '../../libs/rules';

const shapes = [ROCK, PAPER, SCISSORS];

export const ShapeSelector = ({onClick, selectedShape}) => {
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
}

const WinButton = ({player, shape}) => {
  console.log('PLAYER', player)
  return <Button
    color='teal'
    size='huge'
    icon={'hand outline ' + SHAPE_TO_ICON[shape]}
    label={{ basic: false, color: 'teal', pointing: player ? 'left' : 'right', content: 'Win!' }}
    labelPosition={ player ? 'right' : 'left' }
    active
  />
};

const LoseButton = ({shape}) => {
  return <Button
    color='teal'
    size='huge'
    icon={'hand outline ' + SHAPE_TO_ICON[shape]}
    active
  />
};

export const SelectedShape = ({player, shape, opponentShape}) => {
  const isWin = RULES[shape] === opponentShape;

  return isWin
    ? <WinButton shape={shape} player={player} />
    : <LoseButton shape={shape} />
}
