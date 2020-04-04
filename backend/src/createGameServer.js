import http from 'http';
import express from 'express';
import cors from 'cors';
import * as colyseus from 'colyseus';

import Game2pRoom from './Game2pRoom';

export default () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const server = http.createServer(app);
  const gameServer = new colyseus.Server({
    server,
  });

  gameServer.define('game_2p_room', Game2pRoom);

  return gameServer;
};
