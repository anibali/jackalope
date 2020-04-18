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
  spades: CardStyle.SpadesCard,
  hearts: CardStyle.HeartsCard,
  diamonds: CardStyle.DiamondsCard,
  clubs: CardStyle.ClubsCard,
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
  0: 'P1Chip',
  1: 'P2Chip',
};

const HIGHLIGHT_CLASSNAMES = {
  primary: 'CardHighlightPrimary',
  secondary: 'CardHighlightSecondary',
};


const Card = ({ cardNumber, chip, highlight = '', anim = false }) => {
  // TODO: Explicitly handle cardNumber = -1 (the "joker")
  const cardInfo = getCardInfo(cardNumber);
  const classNames = [CardStyle.Card, SUIT_CLASSNAMES[cardInfo.suit]];
  if(chip != null) {
    classNames.push(CardStyle[CHIP_CLASSNAMES[chip] + (anim ? 'Anim' : '')]);
  }
  if(Object.prototype.hasOwnProperty.call(HIGHLIGHT_CLASSNAMES, highlight)) {
    classNames.push(CardStyle[HIGHLIGHT_CLASSNAMES[highlight]]);
  }
  return (
    <div className={classNames.join(' ')}>
      <span dangerouslySetInnerHTML={{__html: SUIT_ENTITIES[cardInfo.suit] || '&nbsp;'}} />
      {VALUE_CHARS[cardInfo.value]}
    </div>
  );
};


export default Card;
