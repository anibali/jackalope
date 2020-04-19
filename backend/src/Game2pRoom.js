import { Room } from 'colyseus';
import { isOneEyedJack } from './getCardInfo';
import GameState from './state/GameState';


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

    const curPlayers = Object.keys(this.state.players);
    if(curPlayers.length >= this.maxClients) {
      const firstPlayerIndex = Math.floor(Math.random() * curPlayers.length);
      this.state.currentTurn = curPlayers[firstPlayerIndex];
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
      const oldChipOwner = this.state.boardChips[boardLocation];
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
      // If a one-eyed jack was played, recalculate sequences for player owning removed chip.
      if(isOneEyedJack(cardNumber)) {
        this.state.players[oldChipOwner].setSequences(this.state.findSequences(oldChipOwner));
      }
      // Check victory condition.
      const sequences = this.state.findSequences(card.owner);
      this.state.players[card.owner].setSequences(sequences);
      if(sequences.length >= 2) {
        this.state.victor = card.owner;
        this.state.currentTurn = '';
      } else {
        // Draw a replacement card.
        this.state.drawCard(card.owner);
        // Change current turn.
        this.state.changeTurn();
      }
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
