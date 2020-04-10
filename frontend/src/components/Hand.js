import React from 'react';
import { connect } from 'react-redux';
import { useDrag } from 'react-dnd';

import Card from './Card';


const HandCard = ({ cardNumber, chip }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'card', cardNumber },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return <span ref={drag}><Card cardNumber={cardNumber} chip={chip} /></span>;
};


const Hand = ({ hand, chip }) => (
  <div>
    Your hand:
    <div>
      {hand.map(card => <HandCard key={card.number} cardNumber={card.number} chip={chip} />)}
    </div>
  </div>
);


export default connect(state => {
  const cards = state.gameState.cards || [];
  const playerId = state.roomInfo.sessionId;
  const hand = cards.filter(card => card.owner === playerId && !card.discarded);
  const chip = state.gameState.players[playerId].seatNumber;
  return { hand, chip };
})(Hand);
