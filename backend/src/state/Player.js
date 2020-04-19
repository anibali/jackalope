import * as schema from '@colyseus/schema';


class Player extends schema.Schema {
  constructor(id, seatNumber) {
    super();
    this.id = id;
    this.seatNumber = seatNumber;
    this.sequenceSquares = new schema.ArraySchema();
  }

  setSequences(sequences) {
    this.sequenceSquares.splice(0, this.sequenceSquares.length);
    this.sequenceSquares.push(...sequences.flat());
  }
}

schema.defineTypes(Player, {
  id: 'string',
  seatNumber: 'int8',
  sequenceSquares: ['int32'],
});


export default Player;
