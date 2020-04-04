import React from 'react';
import ReactDOM from 'react-dom';
import * as Colyseus from 'colyseus.js';

import ClientRoot from './components/ClientRoot';


// Client main function
export default () => {
  const gameServerAddress = `${window.location.protocol.replace('http', 'ws')}//${window.location.hostname}:2567`;

  const client = new Colyseus.Client(gameServerAddress);
  client.joinOrCreate('game_2p_room', { private: false }).then(room => {
    console.log(room.sessionId, 'joined', room.id);

    room.onStateChange((state) => {
      console.log('current turn: ', state.currentTurn);
    });
  }).catch(e => {
    console.log('JOIN ERROR', e);
  });

  // Mount our React root component in the DOM.
  const mountPoint = document.getElementById('root');
  ReactDOM.render(<ClientRoot />, mountPoint);
};
