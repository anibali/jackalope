import React, { useCallback, useContext } from 'react';
import { useDrop } from 'react-dnd';
import { connect } from 'react-redux';
import { isOneEyedJack, isTwoEyedJack } from '../getCardInfo';
import RoomContext from '../RoomContext';
import Card from './Card';


const DiscardPile = ({ discardedCards, boardLayout, boardChips, getCardByNumber }) => {
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
      if(discardedCards.length > 0) {
        const lastDiscard = discardedCards[discardedCards.length - 1];
        if(lastDiscard.owner === getCardByNumber(item.cardNumber).owner) {
          return false;
        }
      }
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
  let highlight = '';
  if(isOver) {
    highlight = 'primary';
  } else if(canDrop) {
    highlight = 'secondary';
  }
  return (
    <div>
      Discard:
      <br />
      <div ref={drop}>
        <Card cardNumber={cardNumber} highlight={highlight} />
      </div>
    </div>
  );
};


export default connect(state => ({
  discardedCards: (state.gameState.discardPile || []).map(n => state.gameState.cards.find(c => c.number === n)),
  boardLayout: state.gameState.boardLayout,
  boardChips: state.gameState.boardChips,
  getCardByNumber: n => state.gameState.cards.find(c => c.number === n),
}))(DiscardPile);
