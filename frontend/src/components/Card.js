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
  2: 'P3Chip',
};

const HIGHLIGHT_CLASSNAMES = {
  primary: 'CardHighlightPrimary',
  secondary: 'CardHighlightSecondary',
};


const Card = ({ cardNumber, chip, superChip, highlight = '', anim = false }) => {
  const cardInfo = getCardInfo(cardNumber);
  let entity = '&nbsp';
  let suitClassname = '';
  if(cardNumber === -1) {
    // Joker
    entity = '&#9733;';
    suitClassname = CardStyle.JokerCard;
  } else if(cardInfo.suit) {
    // Normal card
    entity = SUIT_ENTITIES[cardInfo.suit];
    suitClassname = SUIT_CLASSNAMES[cardInfo.suit];
  }
  const classNames = [CardStyle.Card, suitClassname];
  if(chip != null) {
    let suffix = '';
    if(superChip) {
      suffix = 'Super';
    } else if(anim) {
      suffix = 'Anim';
    }
    classNames.push(CardStyle[CHIP_CLASSNAMES[chip] + suffix]);
  }
  if(Object.prototype.hasOwnProperty.call(HIGHLIGHT_CLASSNAMES, highlight)) {
    classNames.push(CardStyle[HIGHLIGHT_CLASSNAMES[highlight]]);
  }
  return (
    <div className={classNames.join(' ')}>
      <span dangerouslySetInnerHTML={{__html: entity}} />
      {VALUE_CHARS[cardInfo.value]}
    </div>
  );
};


export default Card;
