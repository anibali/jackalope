import { Room } from 'colyseus';

import GameState from './state/GameState';
import { isOneEyedJack, isTwoEyedJack } from './getCardInfo';


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
    this.state.addPlayer(client.sessionId);

    if(Object.keys(this.state.players).length >= this.maxClients) {
      // FIXME: Start turn on seat number 0.
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
      // Find card in game state.
      const card = this.state.getCardByNumber(cardNumber);
      if(!card) {
        return;
      }
      // Verify that client.id matches the card's owner.
      if(card.owner !== client.id) {
        return;
      }
      // Try to play the card.
      if(!this.state.playCard(card, boardLocation)) {
        return;
      }
      // Draw a replacement card.
      this.state.drawCard(card.owner);
      // Change current turn.
      this.state.changeTurn();
    }

    if(message.type === 'replace-dead-card') {
      const { cardNumber } = message.payload;
      // Find card in game state.
      const card = this.state.getCardByNumber(cardNumber);
      if(!card) {
        return;
      }
      // Verify that client.id matches the card's owner.
      if(card.owner !== client.id) {
        return;
      }
      // Try to replace the card.
      this.state.replaceDeadCard(card);
    }
  }

  onLeave(client) {
    console.log(`${client.id} left ${this.roomId}`);
    // Any player leaving terminates the game.
    this.state.terminated = true;
  }

  onDispose() {
    console.log(`disposed room ${this.roomId}`);
  }
}
