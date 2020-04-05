import React from 'react';
import { connect } from 'react-redux';
import { useDrag } from 'react-dnd';

import Card from './Card';


const HandCard = ({ cardNumber }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'card', cardNumber },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return <span ref={drag}><Card cardNumber={cardNumber} /></span>;
};


const Hand = ({ hand }) => (
  <div>
    Your hand:
    <div>
      {hand.map(card => <HandCard key={card.number} cardNumber={card.number} />)}
    </div>
  </div>
);


export default connect(state => {
  const cards = state.gameState.cards || [];
  const hand = cards.filter(card => card.owner === state.roomInfo.sessionId && !card.discarded);
  return { hand };
})(Hand);
