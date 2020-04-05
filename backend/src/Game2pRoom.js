import { Room } from 'colyseus';

import GameState from './GameState';


export default class extends Room {
  constructor() {
    super();
    this.maxClients = 2;
  }

  onCreate(options) {
    console.log(`created room ${this.roomId}`);

    // If the room is private, make sure that it is unlisted.
    if(options.private) {
      this.setPrivate();
    }

    this.setState(new GameState());
  }

  onJoin(client) {
    this.state.players[client.sessionId] = client.sessionId;

    if(Object.keys(this.state.players).length >= this.maxClients) {
      this.state.currentTurn = client.sessionId;
      // We've filled all player slots, so lock the room to prevent anyone else from joining.
      this.lock();
      // Draw player hands.
      Object.keys(this.state.players).forEach(player => {
        for(let i = 0; i < 7; ++i) {
          this.state.drawCard(player);
        }
      });
    }

    console.log(`${client.id} joined ${this.roomId}`);
  }

  onMessage(client, message) {
    console.log(`${client.id} sent message ${JSON.stringify(message)} to room ${this.roomId}`);

    if(message.type === 'play-card') {
      const { cardNumber, boardLocation } = message.payload;
      // 1. Find card in game state.
      const card = this.state.getCardByNumber(cardNumber);
      if(!card) {
        return;
      }
      // 2. Verify that client.id matches the card's owner.
      if(card.owner !== client.id) {
        return;
      }
      // 3. Validate that the move is valid.
      // TODO: Check current turn.
      if(card.discarded) {
        return;
      }
      const destNumber = this.state.boardLayout[boardLocation];
      if(destNumber < 0) {
        // Can't play onto a joker square.
        return;
      }
      if(this.state.boardLayout[boardLocation] % 52 !== cardNumber % 52) {
        // TODO: Jack logic.
        return;
      }
      // 4. Place chip on the board and discard card.
      this.state.boardChips[boardLocation] = card.owner;
      card.discarded = true;
    }
  }

  onLeave(client) {
    console.log(`${client.id} left ${this.roomId}`);
  }

  onDispose() {
    console.log(`disposed room ${this.roomId}`);
  }
}
