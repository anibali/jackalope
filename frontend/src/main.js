import React from 'react';
import ReactDOM from 'react-dom';
import * as Colyseus from 'colyseus.js';

import createStore from './createStore';
import ClientRoot from './components/ClientRoot';
import { changeGameState } from './reducers/gameState';
import { setRoomInfo } from './reducers/roomInfo';


const toPlainData = (data) => {
  if(Array.isArray(data)) {
    return data.map(toPlainData);
  }
  if(data !== null && typeof data === 'object') {
    const plainData = {};
    Object.keys(data).forEach(key => {
      plainData[key] = toPlainData(data[key]);
    });
    return plainData;
  }
  return data;
};


const currentQueryParams = () => {
  const queryParts = window.location.search.substring(1).split('&');
  const query = {};
  queryParts.forEach(part => {
    const pair = part.split('=');
    const key = decodeURIComponent(pair[0]);
    const value = decodeURIComponent(pair[1]);
    query[key] = value;
  });
  return query;
};


// Client main function
export default () => {
  const store = createStore();

  const gameServerAddress = `${window.location.protocol.replace('http', 'ws')}//${window.location.hostname}:2567`;
  const gameClient = new Colyseus.Client(gameServerAddress);

  // const params = currentQueryParams();
  // let joinPromise;
  // if(params.roomId) {
  //   joinPromise = gameClient.joinById(params.roomId);
  // } else {
  //   joinPromise = gameClient.create('game_2p_room', { private: true });
  // }
  const joinPromise = gameClient.joinOrCreate('game_2p_room', { private: false });

  joinPromise.then(room => {
    store.dispatch(setRoomInfo({ sessionId: room.sessionId, roomId: room.id }));
    window.history.replaceState({}, '', `?roomId=${room.id}`);

    room.state.onChange = (changes) => {
      changes.forEach(change => {
        const value = toPlainData(change.value);
        store.dispatch(changeGameState({ field: change.field, value }));
      });
    };
  }).catch(err => {
    console.error('JOIN ERROR', err);
  });

  // Mount our React root component in the DOM.
  const mountPoint = document.getElementById('root');
  ReactDOM.render(<ClientRoot store={store} gameClient={gameClient} />, mountPoint);
};
