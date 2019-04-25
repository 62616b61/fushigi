import React, { useContext } from 'react';
import { Table, Dimmer, Icon, Loader, Grid, Header, Segment, Label } from 'semantic-ui-react';

import { PlayContext } from '../../context/play';
import ShapeSelector from '../ShapeSelector';
import SelectedShape from '../SelectedShape';

import {
  GAME_STATUS_WAITING,
  GAME_STATUS_PLAYING,
  GAME_STATUS_ROUND_FINISHED,
  GAME_STATUS_GAME_FINISHED,
} from '../../libs/game';

import {
  STATUS_DISCONNECTED,
  STATUS_CONNECTED,
  STATUS_PLAYING,
  STATUS_CHOSE_SHAPE,
} from '../../libs/player';

import { UNKNOWN } from '../../libs/shapes';

import * as style from './playerCell.module.css';

const PLAYER_STATUS_TO_TEXT = {
  [ STATUS_DISCONNECTED ]: 'Player has disconnected.',
  [ STATUS_CONNECTED ]: 'Player is thinking.',
  [ STATUS_PLAYING ]: 'Player is thinking.',
  [ STATUS_CHOSE_SHAPE ]: 'Player chose shape.',
};

function EmptyCell() {
  return (
    <Icon
      size='massive' 
      name='cancel'
    />
  );
}

function MyselfCell({ player }) {
  const { status } = useContext(PlayContext);

  const isFinish = [GAME_STATUS_ROUND_FINISHED, GAME_STATUS_GAME_FINISHED].includes(status);
  const isPlaying = status === GAME_STATUS_PLAYING; 
  const isWaiting = status === GAME_STATUS_WAITING; 

  const playerSelectedShape = player.shape !== UNKNOWN;

  const selectedShape = isFinish && ((playerSelectedShape && player.lost) || !player.lost)
    ? <SelectedShape player={ player } />
    : null;

  const shapeSelector = isPlaying && !player.lost
    ? <ShapeSelector />
    : null;

  const lostIcon = !playerSelectedShape && player.lost ? (
    <Icon
      size='huge'
      name='meh outline'
    />
  ) : null;

  const message = isWaiting ? PLAYER_STATUS_TO_TEXT[player.status] : null;

  return (
    <Grid>
      <Grid.Column>
        { shapeSelector }
        { selectedShape }
        { lostIcon }
        { message }
      </Grid.Column>
    </Grid>
  );
}

function OpponentCell({ player }) {
  const { status } = useContext(PlayContext);

  const isFinish = [GAME_STATUS_ROUND_FINISHED, GAME_STATUS_GAME_FINISHED].includes(status);
  const playerSelectedShape = player.shape !== UNKNOWN;

  const selectedShape = isFinish && ((playerSelectedShape && player.lost) || !player.lost)
    ? <SelectedShape player={ player } />
    : null;

  const lostIcon = !playerSelectedShape && player.lost ? (
    <Icon
      size='huge'
      name='meh outline'
    />
  ) : null;

  const message = !isFinish && !player.lost ? PLAYER_STATUS_TO_TEXT[player.status] : null;

  return (
    <Grid>
      <Grid.Column>
        { selectedShape }
        { lostIcon }
        { message }
      </Grid.Column>
    </Grid>
  );
}

export default function PlayerCell({ player }) {
  const { myself } = useContext(PlayContext);

  const isEmptyCell = !player;
  const isMyself = !isEmptyCell && player.id === myself.id;
  const isLost = !isEmptyCell && player.lost;

  const emptyCellClass = isEmptyCell ? style.empty : null;
  const lostCellClass = isLost ? style.lost : null;

  let cell;

  if (isEmptyCell) {
    cell = <EmptyCell />
  } else {
    if (isMyself) {
      cell = <MyselfCell player={player} />
    } else {
      cell = <OpponentCell player={player} />
    }
  }


  //const shapeSelectInterface = status === GAME_STATUS_PLAYING
    //? <ShapeSelector />
    //: <SelectedShape player={ player } />;

          //<Header as='h3'>Nickname: {player.id}</Header>
          //<Label content={player.score} color='grey' />
  //

        //<Grid.Column>
          //{ player && player.lost ? <p>You lost</p> : shapeSelectInterface }
        //</Grid.Column>

  return (
    <Table.Cell className={`${style.cell} ${emptyCellClass} ${lostCellClass}`}>
      { cell }
    </Table.Cell>
  );
}

function OpponentCellOld({ player }) {
  const { status } = useContext(PlayContext);

  const selectedShape = [GAME_STATUS_ROUND_FINISHED, GAME_STATUS_GAME_FINISHED].includes(status)
    ? <SelectedShape player={ player } />
    : null;

  const playerStatus = !selectedShape
    ? player.lost
    ? <p>Player lost</p>
    : <p>{ PLAYER_STATUS_TO_TEXT[player.status] }</p>
    : null;

          //<Header as='h3'>Nickname: {player.id}</Header>
          //<Label content={player.score} color='grey' />

  return (
    <Table.Cell className={ style.cell }>
      <Grid>
        <Grid.Column>
          { playerStatus }
          { selectedShape }
        </Grid.Column>
      </Grid>
    </Table.Cell>
  );
}

