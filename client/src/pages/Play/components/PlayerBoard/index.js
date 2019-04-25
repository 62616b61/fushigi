import React, { useContext } from 'react';
import { Table, Dimmer, Icon, Loader, Grid, Header, Segment, Label } from 'semantic-ui-react';

import { PlayContext } from '../../context/play';
import { AppContext } from '../../../../context/app';
import PlayerCell from '../PlayerCell';

const BOARD_WIDTH = 2;
const BOARD_HEIGHT = 2;

function PlayerBoard() {
  const { isConnected, myself, others } = useContext(PlayContext);
  const { playerId } = useContext(AppContext);

  const playersSorted = [ myself, ...others ];

  let board = [];
  for (let row = 0; row < BOARD_HEIGHT; row += 1) {
    if (!board[row]) board.push([]);

    for (let cell = 0; cell < BOARD_WIDTH; cell += 1) {
      const coord = (row * BOARD_WIDTH) + cell;
      const player = playersSorted[coord];

      if (player) board[row][cell] = player;
      else board[row][cell] = null;
    }
  }

  const parsedBoard = board.map((row, i) => {
    const cells = row.map((player, j) => {
      return <PlayerCell player={player} key={'player' + j} />
    });

    return (
      <Table.Row style={{ textAlign: 'center' }} key={i} columns={BOARD_WIDTH}>
        { cells }
      </Table.Row>
    );
  });

  return (
    <Segment>
      <Dimmer active={!isConnected}>
        <Loader>Connecting to runner...</Loader>
      </Dimmer>
      <Table celled padded>
        <Table.Body>
          { parsedBoard }
        </Table.Body>
      </Table>
    </Segment>
  );
}

export default PlayerBoard;
