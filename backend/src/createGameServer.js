import * as colyseus from 'colyseus';
import http from 'http';
import GameRoom from './GameRoom';


export default (app) => {
  const server = http.createServer(app);
  const gameServer = new colyseus.Server({
    server,
    express: app,
  });

  gameServer.define('game_room', GameRoom);

  return gameServer;
};
