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

  onLeave(client) {
    console.log(`${client.id} left ${this.roomId}`);
  }

  onDispose() {
    console.log(`disposed room ${this.roomId}`);
  }
}
