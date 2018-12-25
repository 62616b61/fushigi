import React from 'react';
import { Button }  from 'semantic-ui-react';
import { SHAPE_TO_ICON } from '../../libs/shapes';
import { RULES } from '../../libs/rules';

const WinButton = ({player, shape}) => {
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

const SelectedShape = ({player, shape, opponentShape}) => {
  const isWin = RULES[shape] === opponentShape;

  return isWin
    ? <WinButton shape={shape} player={player} />
    : <LoseButton shape={shape} />
}

export default SelectedShape;
