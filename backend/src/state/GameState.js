import * as schema from '@colyseus/schema';
import { shuffle } from 'd3-array';
import { isOneEyedJack, isTwoEyedJack } from '../getCardInfo';
import Card from './Card';
import Player from './Player';


/* eslint-disable no-multi-spaces */
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
/* eslint-enable no-multi-spaces */

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
    this.terminated = false;
    this.discardPile = new schema.ArraySchema();
    this.currentTurn = '';
    this.victor = '';
  }

  addPlayer(playerId) {
    const player = new Player(playerId, Object.keys(this.players).length);
    this.players[playerId] = player;
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
    return this.cards.find(c => c.number === cardNumber);
  }

  changeTurn() {
    const curSeatNumber = this.players[this.currentTurn].seatNumber;
    const nextSeatNumber = (curSeatNumber + 1) % Object.keys(this.players).length;
    const nextPlayer = Object.values(this.players).find(p => p.seatNumber === nextSeatNumber);
    this.currentTurn = nextPlayer.id;
  }

  discardCard(card) {
    card.discarded = true;
    this.discardPile.push(card.number);
  }

  replaceDeadCard(card) {
    // Check that it's the card owner's turn.
    if(this.currentTurn !== card.owner) {
      return false;
    }
    // Check that the card is in its owner's hand.
    if(card.discarded) {
      return false;
    }
    // Only allow one dead card replacement per turn.
    if(this.discardPile.length > 0) {
      const lastDiscard = this.getCardByNumber(this.discardPile[this.discardPile.length - 1]);
      if(lastDiscard.owner === card.owner) {
        return false;
      }
    }
    // Verify that card is dead.
    if(isOneEyedJack(card.number) || isTwoEyedJack(card.number)) {
      return false;
    }
    if(this.boardLayout.findIndex((e, i) => e % 52 === card.number % 52
        && !this.boardChips[i]) >= 0) {
      return false;
    }
    // Replace the card.
    this.discardCard(card);
    this.drawCard(card.owner);
    return true;
  }

  playCard(card, boardLocation) {
    // Check that it's the card owner's turn.
    if(this.currentTurn !== card.owner) {
      return false;
    }
    // Check that the card is in its owner's hand.
    if(card.discarded) {
      return false;
    }
    // Check that the destination board square is valid.
    const destNumber = this.boardLayout[boardLocation];
    if(destNumber < 0) {
      // Can't play onto a joker square.
      return false;
    }
    if(this.boardChips[boardLocation]) {
      if(!isOneEyedJack(card.number)) {
        return false;
      }
    } else if((this.boardLayout[boardLocation] % 52 !== card.number % 52)
        && !isTwoEyedJack(card.number)) {
      return false;
    }
    // Modify chips on the board.
    if(isOneEyedJack(card.number)) {
      this.boardChips[boardLocation] = '';
    } else {
      this.boardChips[boardLocation] = card.owner;
    }
    // Move the card to the discard pile.
    this.discardCard(card);
    return true;
  }

  countSequences(playerId) {
    const width = 10;
    const height = 10;
    const seqLength = 5;
    const seqRange = [...Array(seqLength).keys()];
    let count = 0;

    // Create another represenation of the board, where each square is a number.
    // 0 = unoccupied by the player.
    // 1 = occupied by the player (or wild/joker square).
    // 2 = occupied by the player, but already used in a sequence.
    const b = [];
    for(let y = 0; y < height; ++y) {
      const row = [];
      for(let x = 0; x < width; ++x) {
        const i = y * width + x;
        let cell = 0;
        if(this.boardLayout[i] === -1) {
          cell = 1;
        } else if(this.boardChips[i] === playerId) {
          cell = 1;
        }
        row.push(cell);
      }
      b.push(row);
    }

    for(let y = 0; y < height; ++y) {
      for(let x = 0; x < width; ++x) {
        if(b[y][x] !== 0) {
          const toCheck = [];

          // Horizontal -
          if(x <= width - seqLength) {
            toCheck.push(seqRange.map(i => [y, x + i]));
          }

          // Vertical |
          if(y <= height - seqLength) {
            toCheck.push(seqRange.map(i => [y + i, x]));
          }

          // Backward diagonal \
          if(x <= width - seqLength && y <= height - seqLength) {
            toCheck.push(seqRange.map(i => [y + i, x + i]));
          }

          // Forward diagonal /
          if(x >= seqLength - 1 && y <= height - seqLength) {
            toCheck.push(seqRange.map(i => [y + i, x - i]));
          }

          // Check for sequences
          count = toCheck.reduce((acc, coords) => {
            let allowReuse = true;
            let isSequence = true;

            coords.forEach(([r, c]) => {
              if(b[r][c] === 0) {
                isSequence = false;
              }
              if(b[r][c] === 2) {
                if(allowReuse) {
                  allowReuse = false;
                } else {
                  isSequence = false;
                }
              }
            });

            if(isSequence) {
              coords.forEach(([r, c]) => {
                b[r][c] = 2;
              });
              return acc + 1;
            }
            return acc;
          }, count);
        }
      }
    }
    return count;
  }
}

schema.defineTypes(GameState, {
  currentTurn: 'string',
  players: { map: Player },
  boardChips: ['string'], // TODO: Make int8 for better efficiency
  boardLayout: ['int32'],
  cards: [Card],
  terminated: 'boolean',
  discardPile: ['int32'],
  victor: 'string',
});

export default GameState;
