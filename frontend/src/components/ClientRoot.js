import React from 'react';
import { Provider } from 'react-redux';

import Board from './Board';
import Hand from './Hand';
import GameClientContext from '../GameClientContext';


const ClientRoot = ({ store, gameClient }) => (
  <Provider store={store}>
    <GameClientContext.Provider value={gameClient}>
      <Board />
      <Hand />
    </GameClientContext.Provider>
  </Provider>
);


export default ClientRoot;
