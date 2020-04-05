import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { useDrop } from 'react-dnd';

import RoomContext from '../RoomContext';
import Card from './Card';
import { isOneEyedJack, isTwoEyedJack } from '../getCardInfo';
import BoardStyle from '../styles/Board.css';


const BoardSquare = ({ cardNumber, chip, boardLocation, onPlayCard }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'card',
    drop: item => onPlayCard(item.cardNumber, boardLocation),
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
    canDrop: item => {
      if(cardNumber < 0) {
        // Can never place a chip on the joker squares.
        return false;
      }
      if(chip != null) {
        return isOneEyedJack(item.cardNumber);
      }
      return (item.cardNumber % 52) === (cardNumber % 52) || isTwoEyedJack(item.cardNumber);
    }
  });
  let className = '';
  if(isOver) {
    className = BoardStyle.DropHover;
  } else if(canDrop) {
    className = BoardStyle.DropValid;
  }
  return (
    <div ref={drop} className={className}>
      <Card cardNumber={cardNumber} chip={chip} />
    </div>
  );
};


const Board = ({ boardLayout, boardChips, players }) => {
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
      let chip = null;
      if(boardChips[boardLocation] && players[boardChips[boardLocation]]) {
        chip = players[boardChips[boardLocation]].seatNumber;
      }
      tableRow.push(
        <td key={col}>
          <BoardSquare
            cardNumber={boardLayout[boardLocation]}
            chip={chip}
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
  players: state.gameState.players || {},
}))(Board);
