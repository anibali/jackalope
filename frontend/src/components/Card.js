import React from 'react';

import getCardInfo from '../getCardInfo';
import CardStyle from '../styles/Card.css';


const SUIT_ENTITIES = {
  spades: '&spades;',
  hearts: '&hearts;',
  diamonds: '&diams;',
  clubs: '&clubs;',
};

const SUIT_CLASSNAMES = {
  spades: CardStyle.BlackCard,
  hearts: CardStyle.RedCard,
  diamonds: CardStyle.RedCard,
  clubs: CardStyle.BlackCard,
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

const CHIP_CLASSNAMES = {
  0: CardStyle.P1Chip,
  1: CardStyle.P2Chip,
};


const Card = ({ cardNumber, chip }) => {
  // TODO: Explicitly handle cardNumber = -1 (the "joker")
  const cardInfo = getCardInfo(cardNumber);
  const classNames = [CardStyle.Card, SUIT_CLASSNAMES[cardInfo.suit]];
  if(chip != null) {
    classNames.push(CHIP_CLASSNAMES[chip]);
  }
  return (
    <div className={classNames.join(' ')}>
      <span dangerouslySetInnerHTML={{__html: SUIT_ENTITIES[cardInfo.suit] || '&nbsp;'}} />
      {VALUE_CHARS[cardInfo.value]}
    </div>
  );
};


export default Card;
