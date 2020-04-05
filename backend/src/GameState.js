import * as schema from '@colyseus/schema';
import { shuffle } from 'd3-array';


const crossBoardLayout = [
  -1, 38, 34, 30, 26, 24, 28, 32, 36, -1,
  39, 51, 22, 18, 14, 12, 16, 20, 49, 37,
  35, 23, 47, 10,  6,  4,  8, 45, 21, 33,
  31, 19, 11, 46,  2,  0, 44,  9, 17, 29,
  27, 15,  7,  3, 50, 48,  1,  5, 13, 25,
  25, 13,  5,  1, 48, 50,  3,  7, 15, 27,
  29, 17,  9, 44,  0,  2, 46, 11, 19, 31,
  33, 21, 45,  8,  4,  6, 10, 47, 23, 35,
  37, 49, 20, 16, 12, 14, 18, 22, 51, 39,
  -1, 36, 32, 28, 24, 26, 30, 34, 38, -1,
];

class Card extends schema.Schema {
  constructor() {
    super();
    this.owner = '';
    this.discarded = false;
  }
}

schema.defineTypes(Card, {
  owner: 'string',
  discarded: 'boolean',
  number: 'int32',
});

schema.filter(function(client) {
  // Players can identify any discarded card, and any card in their own hand.
  return this.discarded || this.owner === client.sessionId;
})(Card.prototype, 'number');

class GameState extends schema.Schema {
  constructor() {
    super();
    this.players = new schema.MapSchema();

    const boardChipsValues = [];
    for(let i = 0; i < 100; ++i) {
      boardChipsValues.push('');
    }
    this.boardChips = new schema.ArraySchema(...boardChipsValues);
    this.boardLayout = new schema.ArraySchema(...crossBoardLayout);

    const deck = [];
    for(let i = 0; i < 104; ++i) {
      const card = new Card();
      card.number = i;
      deck.push(card);
    }
    shuffle(deck);
    this.cards = new schema.ArraySchema(...deck);
  }

  drawCard(player) {
    let card = null;
    for(let i = 0; i < this.cards.length; ++i) {
      if(!this.cards[i].discarded && !this.cards[i].owner) {
        card = this.cards[i];
        break;
      }
    }
    if(card !== null) {
      card.owner = player;
    }
    return card;
  }

  getCardByNumber(cardNumber) {
    for(let i = 0; i < this.cards.length; ++i) {
      if(this.cards[i].number === cardNumber) {
        return this.cards[i];
      }
    }
    return null;
  }
}

schema.defineTypes(GameState, {
  currentTurn: 'string',
  players: { map: 'string' },
  boardChips: ['string'], // TODO: Make int8 for better efficiency
  boardLayout: ['int32'],
  cards: [Card],
});

export default GameState;
export { Card };
