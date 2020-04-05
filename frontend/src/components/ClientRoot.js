import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import Board from './Board';
import Hand from './Hand';
import GameClientContext from '../GameClientContext';
import RoomContext from '../RoomContext';
import { changeGameState } from '../reducers/gameState';
import { setRoomInfo } from '../reducers/roomInfo';


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


const ClientRoot = ({ store, gameClient }) => {
  const [room, setRoom] = useState(null);
  const [joiningRoom, setJoiningRoom] = useState(false);

  useEffect(() => {
    if(room == null && !joiningRoom) {
      setJoiningRoom(true);

      // const params = currentQueryParams();
      // let joinPromise;
      // if(params.roomId) {
      //   joinPromise = gameClient.joinById(params.roomId);
      // } else {
      //   joinPromise = gameClient.create('game_2p_room', { private: true });
      // }
      const joinPromise = gameClient.joinOrCreate('game_2p_room', { private: false });

      joinPromise.then(newRoom => {
        store.dispatch(setRoomInfo({ sessionId: newRoom.sessionId, roomId: newRoom.id }));
        window.history.replaceState({}, '', `?roomId=${newRoom.id}`);

        newRoom.state.onChange = (changes) => {
          changes.forEach(change => {
            const value = toPlainData(change.value);
            store.dispatch(changeGameState({ field: change.field, value }));
          });
        };

        setRoom(newRoom);
      }).catch(err => {
        console.error('JOIN ERROR', err);
      });
    }
  });

  return (
    <Provider store={store}>
      <GameClientContext.Provider value={gameClient}>
        <RoomContext.Provider value={[room, setRoom]}>
          <h1>Jackalope</h1>
          <DndProvider backend={Backend}>
            <Board />
            <Hand />
          </DndProvider>
        </RoomContext.Provider>
      </GameClientContext.Provider>
    </Provider>
  );
};


export default ClientRoot;
