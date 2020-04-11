import React from 'react';
import ReactDOM from 'react-dom';
import * as Colyseus from 'colyseus.js';

import createStore from './createStore';
import ClientRoot from './components/ClientRoot';


// Client main function
export default () => {
  const store = createStore();

  let gameServerAddress;
  if(process.env.NODE_ENV === 'production') {
    gameServerAddress = `${window.location.protocol.replace('http', 'ws')}//${window.location.host}`;
  } else {
    gameServerAddress = `${window.location.protocol.replace('http', 'ws')}//${window.location.hostname}:2567`;
  }
  const gameClient = new Colyseus.Client(gameServerAddress);

  // Mount our React root component in the DOM.
  const mountPoint = document.getElementById('root');
  ReactDOM.render(<ClientRoot store={store} gameClient={gameClient} />, mountPoint);
};
