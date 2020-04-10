import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import Board from './Board';
import Hand from './Hand';
import TurnIndicator from './TurnIndicator';


const PlayingPage = ({ room, setRoom, players, terminated }) => {
  const history = useHistory();

  useEffect(() => {
    if(terminated && room != null) {
      room.leave();
      setRoom(null);
    }
  });

  if(room == null) {
    return <Redirect to="/" />;
  }

  if(Object.keys(players).length < 2) {
    let urlString = `${window.location.protocol}//${window.location.host}`;
    urlString += history.createHref({ pathname: `join/${room.id}` });
    return (
      <div>
        <p>
          Waiting for other players to join.
        </p>
        <p>
          You can invite another person to play by sharing the following link:
        </p>
        <pre>{urlString}</pre>
      </div>
    );
  }

  return (
    <div>
      <TurnIndicator playerId={room ? room.sessionId : null} />
      <DndProvider backend={Backend} options={HTML5toTouch}>
        <Board />
        <Hand />
      </DndProvider>
    </div>
  );
};


export default connect(state => ({
  players: state.gameState.players || {},
  terminated: state.gameState.terminated,
}))(PlayingPage);