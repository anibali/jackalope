import React from 'react';
import { connect } from 'react-redux';

import Card from './Card';


const Hand = ({ hand }) => (
  <div>
    Your hand:
    <div>
      {hand.map(card => <Card key={card.number} cardNumber={card.number} />)}
    </div>
  </div>
);


export default connect(state => {
  const cards = state.gameState.cards || [];
  const hand = cards.filter(card => card.owner === state.roomInfo.sessionId && !card.discarded);
  return { hand };
})(Hand);
