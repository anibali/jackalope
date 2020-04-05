import * as schema from '@colyseus/schema';


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


export default Card;
