import React, { useCallback, useContext } from 'react';
import { useDrop } from 'react-dnd';
import { connect } from 'react-redux';
import { isOneEyedJack, isTwoEyedJack } from '../getCardInfo';
import RoomContext from '../RoomContext';
import BoardStyle from '../styles/Board.css';
import CardStyle from '../styles/Card.css';
import Card from './Card';


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
  const classNames = [CardStyle.CardWrapper];
  if(isOver) {
    classNames.push(BoardStyle.DropHover);
  } else if(canDrop) {
    classNames.push(BoardStyle.DropValid);
  }
  return (
    <div ref={drop} className={classNames.join(' ')}>
      <Card cardNumber={cardNumber} chip={chip} />
    </div>
  );
};


const Board = ({ boardLayout, boardChips, players }) => {
  if(!boardLayout || !boardChips) {
    return null;
  }

  const [room, setRoom] = useContext(RoomContext);

  const onPlayCard = useCallback(
    (cardNumber, boardLocation) => {
      if(!room) {
        return;
      }
      room.send({ type: 'play-card', payload: { cardNumber, boardLocation } });
    },
    [room],
  );

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
