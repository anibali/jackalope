import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { useDrop } from 'react-dnd';

import RoomContext from '../RoomContext';
import Card from './Card';


const BoardSquare = ({ cardNumber, chip, boardLocation, onPlayCard }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'card',
    drop: item => onPlayCard(item.cardNumber, boardLocation),
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
    canDrop: item => (item.cardNumber % 52) === (cardNumber % 52),
  });
  return (
    <span ref={drop} style={{ backgroundColor: isOver ? 'yellow' : (canDrop ? 'blue' : 'inherit') }}>
      <Card cardNumber={cardNumber} chip={chip} />
    </span>
  );
};


const Board = ({ boardLayout, boardChips }) => {
  if(!boardLayout || !boardChips) {
    return null;
  }

  const [room, setRoom] = useContext(RoomContext);

  const onPlayCard = (cardNumber, boardLocation) => {
    if(!room) {
      return;
    }
    room.send({ type: 'play-card', payload: { cardNumber, boardLocation } });
  };

  const tableContent = [];
  for(let row = 0; row < 10; ++row) {
    const tableRow = [];
    for(let col = 0; col < 10; ++col) {
      const boardLocation = row * 10 + col;
      tableRow.push(
        <td key={col}>
          <BoardSquare
            cardNumber={boardLayout[boardLocation]}
            chip={boardChips[boardLocation]}
            boardLocation={boardLocation}
            onPlayCard={onPlayCard}
          />
        </td>
      );
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
