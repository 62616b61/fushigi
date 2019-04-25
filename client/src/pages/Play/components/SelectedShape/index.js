import React from 'react';
import { Button }  from 'semantic-ui-react';
import { SHAPE_TO_ICON } from '../../libs/shapes';

const WinButton = ({player, shape}) => {
  return (
    <Button
      color='teal'
      size='huge'
      icon={SHAPE_TO_ICON[shape]}
      active
    />
  );
};

const LoseButton = ({shape}) => {
  return (
    <Button.Group vertical>
      <Button
        color='red'
        size='huge'
        icon={SHAPE_TO_ICON[shape]}
        active
      />
    </Button.Group>
  );
};

const SelectedShape = ({player}) => {
  const { lost, shape } = player;

  return lost
    ? <LoseButton shape={shape} />
    : <WinButton shape={shape} />;
};

export default SelectedShape;
