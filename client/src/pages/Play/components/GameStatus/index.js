import React, { useContext } from 'react';
import { Table, Grid, Header, Segment, Label } from 'semantic-ui-react';

import { 
  GAME_STATUS_IDLE,
  GAME_STATUS_WAITING,
  GAME_STATUS_PLAYING,
  GAME_STATUS_ROUND_FINISHED,
  GAME_STATUS_GAME_FINISHED,
} from '../../libs/game';

import { PlayContext } from '../../context/play';

export const PRETTY_GAME_STATUS = {
  [ GAME_STATUS_IDLE ]: 'Connecting to the game',
  [ GAME_STATUS_WAITING ]: 'Waiting for more players',
  [ GAME_STATUS_PLAYING ]: 'Choose!',
  [ GAME_STATUS_ROUND_FINISHED ]: 'Prepare for next round!',
  [ GAME_STATUS_GAME_FINISHED ]: 'Winner!',
};

function GameStatus () {
  const { status, counter } = useContext(PlayContext);

  return (
    <Segment>{ PRETTY_GAME_STATUS[status] } : { counter }</Segment>
  );
}

export default GameStatus;
