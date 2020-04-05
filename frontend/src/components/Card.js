import React from 'react';

import getCardInfo from '../getCardInfo';


const SUIT_ENTITIES = {
  spades: '&spades;',
  hearts: '&hearts;',
  diamonds: '&diams;',
  clubs: '&clubs;',
};

const SUIT_COLOURS = {
  spades: 'black',
  hearts: 'red',
  diamonds: 'red',
  clubs: 'black',
};

const VALUE_CHARS = {
  ace: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  jack: 'J',
  queen: 'Q',
  king: 'K',
};


const Card = ({ cardNumber, chip }) => {
  // TODO: Explicitly handle cardNumber = -1 (the "joker")
  const cardInfo = getCardInfo(cardNumber);
  return (
    <div style={{width: 40, height: 40, overflowWrap: 'break-word', border: '1px solid black', display: 'inline-block', color: SUIT_COLOURS[cardInfo.suit]}}>
      <span dangerouslySetInnerHTML={{__html: SUIT_ENTITIES[cardInfo.suit] || '&nbsp;'}} />
      {VALUE_CHARS[cardInfo.value]}
      <br />
      {(chip || '').substring(0, 3)}
    </div>
  );
};


export default Card;
