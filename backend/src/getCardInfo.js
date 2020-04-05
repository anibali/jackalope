const CARD_SUITS = ['spades', 'hearts', 'diamonds', 'clubs'];
const CARD_VALUES = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];


const getCardInfo = (cardNumber) => {
  const deckNumber = cardNumber % (CARD_SUITS.length * CARD_VALUES.length);
  const suit = CARD_SUITS[deckNumber % CARD_SUITS.length];
  const value = CARD_VALUES[Math.floor(deckNumber / CARD_SUITS.length)];
  return { suit, value };
};

const isOneEyedJack = (cardNumber) => {
  const deckNumber = cardNumber % (CARD_SUITS.length * CARD_VALUES.length);
  return deckNumber === 40 || deckNumber === 41;
};

const isTwoEyedJack = (cardNumber) => {
  const deckNumber = cardNumber % (CARD_SUITS.length * CARD_VALUES.length);
  return deckNumber === 42 || deckNumber === 43;
};

export { isOneEyedJack, isTwoEyedJack };
export default getCardInfo;
