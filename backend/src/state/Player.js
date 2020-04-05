import * as schema from '@colyseus/schema';


class Player extends schema.Schema {
  constructor(id, seatNumber) {
    super();
    this.id = id;
    this.seatNumber = seatNumber;
  }
}

schema.defineTypes(Player, {
  id: 'string',
  seatNumber: 'int8',
});


export default Player;
