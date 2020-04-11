import React, { useCallback, useContext } from 'react';
import { useDrop } from 'react-dnd';
import { connect } from 'react-redux';
import { isOneEyedJack, isTwoEyedJack } from '../getCardInfo';
import RoomContext from '../RoomContext';
import BoardStyle from '../styles/Board.css';
import CardStyle from '../styles/Card.css';
import Card from './Card';


const DiscardPile = ({ discardedCards, boardLayout, boardChips }) => {
  const [room, setRoom] = useContext(RoomContext);

  const onDiscardCard = useCallback(
    (cardNumber) => {
      if(!room) {
        return;
      }
      room.send({ type: 'replace-dead-card', payload: { cardNumber } });
    },
    [room],
  );

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'card',
    drop: item => onDiscardCard(item.cardNumber),
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
    canDrop: item => {
      if(isOneEyedJack(item.cardNumber) || isTwoEyedJack(item.cardNumber)) {
        return false;
      }
      if(boardLayout.findIndex((e, i) => e % 52 === item.cardNumber % 52 && !boardChips[i]) >= 0) {
        return false;
      }
      return true;
    }
  });
  const card = discardedCards[discardedCards.length - 1];
  const cardNumber = card ? card.number : -1;
  const classNames = [CardStyle.CardWrapper];
  if(isOver) {
    classNames.push(BoardStyle.DropHover);
  } else if(canDrop) {
    classNames.push(BoardStyle.DropValid);
  }
  return (
    <div>
      Discard:&nbsp;
      <div ref={drop} className={classNames.join(' ')}>
        <Card cardNumber={cardNumber} />
      </div>
    </div>
  );
};


export default connect(state => ({
  discardedCards: (state.gameState.discardPile || []).map(n => state.gameState.cards.find(c => c.number === n)),
  boardLayout: state.gameState.boardLayout,
  boardChips: state.gameState.boardChips,
}))(DiscardPile);
