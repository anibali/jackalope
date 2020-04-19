import React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import { PureBoard } from '../src/components/Board';
import RoomContext from '../src/RoomContext';


const parseBoardChips = rows => rows.flatMap(row => row.split('').map(c => (c === '.' ? '' : c)));

const boardLayout = [
  -1, 38, 34, 30, 26, 24, 28, 32, 36, -1,
  39, 51, 22, 18, 14, 12, 16, 20, 49, 37,
  35, 23, 47, 10,  6,  4,  8, 45, 21, 33,
  31, 19, 11, 46,  2,  0, 44,  9, 17, 29,
  27, 15,  7,  3, 50, 48,  1,  5, 13, 25,
  25, 13,  5,  1, 48, 50,  3,  7, 15, 27,
  29, 17,  9, 44,  0,  2, 46, 11, 19, 31,
  33, 21, 45,  8,  4,  6, 10, 47, 23, 35,
  37, 49, 20, 16, 12, 14, 18, 22, 51, 39,
  -1, 36, 32, 28, 24, 26, 30, 34, 38, -1,
];


export default { title: 'Board' };

export const withEmptyBoard = () => {
  const players = {
    'a': {
      id: 'a',
      seatNumber: 0,
      sequenceSquares: [],
    },
    'b': {
      id: 'b',
      seatNumber: 1,
      sequenceSquares: [],
    },
  };

  const boardChips = parseBoardChips([
    '.........',
    '.........',
    '.........',
    '.........',
    '..........',
    '..........',
    '........',
    '.........',
    '.........',
    '..........',
  ]);

  return (
    <RoomContext.Provider value={[null, () => {}]}>
      <DndProvider backend={Backend} options={HTML5toTouch}>
        <PureBoard boardLayout={boardLayout} boardChips={boardChips} players={players} />
      </DndProvider>
    </RoomContext.Provider>
  );
};

export const withCompletedGame = () => {
  const players = {
    'a': {
      id: 'a',
      seatNumber: 0,
      sequenceSquares: [18, 27, 36, 45, 25, 36, 47, 58, 69],
    },
    'b': {
      id: 'b',
      seatNumber: 1,
      sequenceSquares: [],
    },
  };

  const boardChips = parseBoardChips([
    '....aa..a.',
    '.......aa.',
    '....aaba..',
    '..a...aa..',
    '.b.a.a.ab.',
    '.......ba.',
    'a..bbb..ba',
    'bb.b.a.b.a',
    '.b.b.bb...',
    '....b...b.',
  ]);

  return (
    <RoomContext.Provider value={[null, () => {}]}>
      <DndProvider backend={Backend} options={HTML5toTouch}>
        <PureBoard boardLayout={boardLayout} boardChips={boardChips} players={players} />
      </DndProvider>
    </RoomContext.Provider>
  );
};
