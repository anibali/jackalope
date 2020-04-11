import * as colyseus from 'colyseus';
import http from 'http';
import Game2pRoom from './Game2pRoom';


export default (app) => {
  const server = http.createServer(app);
  const gameServer = new colyseus.Server({
    server,
    express: app,
  });

  gameServer.define('game_2p_room', Game2pRoom);

  return gameServer;
};
