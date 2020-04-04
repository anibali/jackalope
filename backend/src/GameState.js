import * as schema from '@colyseus/schema';

class GameState extends schema.Schema {
  constructor() {
    super();
    this.players = new schema.MapSchema();
  }
}

schema.defineTypes(GameState, {
  currentTurn: 'string',
  players: { map: 'string' },
});

export default GameState;
