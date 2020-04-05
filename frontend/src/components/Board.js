import React from 'react';
import { connect } from 'react-redux';

import Card from './Card';


const Board = ({ boardLayout, boardChips }) => {
  if(!boardLayout || !boardChips) {
    return null;
  }

  const tableContent = [];
  for(let row = 0; row < 10; ++row) {
    const tableRow = [];
    for(let col = 0; col < 10; ++col) {
      tableRow.push(<td key={col}><Card cardNumber={boardLayout[row * 10 + col]} /></td>);
    }
    tableContent.push(<tr key={row}>{tableRow}</tr>);
  }

  return (
    <table><tbody>{tableContent}</tbody></table>
  );
};


export default connect(state => ({
  boardLayout: state.gameState.boardLayout,
  boardChips: state.gameState.boardChips,
}))(Board);
