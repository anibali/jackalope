import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route } from 'react-router-dom';
import GameClientContext from '../GameClientContext';
import RoomContext from '../RoomContext';
import CreatePrivatePage from './CreatePrivatePage';
import HomePage from './HomePage';
import JoinPage from './JoinPage';
import JoinPublicPage from './JoinPublicPage';
import PlayingPage from './PlayingPage';


const ClientRoot = ({ store, gameClient }) => {
  const [room, setRoom] = useState(null);

  return (
    <Provider store={store}>
      <GameClientContext.Provider value={gameClient}>
        <RoomContext.Provider value={[room, setRoom]}>
          <h1>Jackalope</h1>
          <Router>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/playing">
              <PlayingPage room={room} setRoom={setRoom} />
            </Route>
            <Route exact path="/join-public">
              <JoinPublicPage gameClient={gameClient} />
            </Route>
            <Route exact path="/join/:roomId">
              <JoinPage gameClient={gameClient} />
            </Route>
            <Route exact path="/create-private">
              <CreatePrivatePage gameClient={gameClient} />
            </Route>
          </Router>
        </RoomContext.Provider>
      </GameClientContext.Provider>
    </Provider>
  );
};


export default ClientRoot;
