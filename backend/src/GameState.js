import * as schema from '@colyseus/schema';
import { shuffle } from 'd3-array';

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
    this.boardChips = new schema.ArraySchema(1, 2, 3, 4);

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
}

schema.defineTypes(GameState, {
  currentTurn: 'string',
  players: { map: 'string' },
  boardChips: ['int8'],
  cards: [Card],
});

export default GameState;
export { Card };
