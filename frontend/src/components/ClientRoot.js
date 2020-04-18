import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route } from 'react-router-dom';
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
      <RoomContext.Provider value={[room, setRoom]}>
        <Container className="mt-2" fluid="md">
          <Router>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/playing">
              <PlayingPage room={room} />
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
        </Container>
      </RoomContext.Provider>
    </Provider>
  );
};


export default ClientRoot;
