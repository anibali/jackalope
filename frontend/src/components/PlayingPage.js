import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import Board from './Board';
import DiscardPile from './DiscardPile';
import Hand from './Hand';
import TurnIndicator from './TurnIndicator';


const PlayingPage = ({ room, players, terminated, victor }) => {
  const history = useHistory();

  useEffect(() => {
    if(terminated && room != null) {
      room.leave();
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

  let topMessage = null;
  if(victor) {
    if(victor === room.sessionId) {
      topMessage = <div>You are victorious! Congratulations!</div>;
    } else {
      topMessage = <div>You have been defeated, better luck next time.</div>;
    }
  } else {
    topMessage = <TurnIndicator playerId={room ? room.sessionId : null} />;
  }

  return (
    <div>
      {topMessage}
      <DndProvider backend={Backend} options={HTML5toTouch}>
        <Board />
        <DiscardPile />
        <Hand />
      </DndProvider>
    </div>
  );
};


export default connect(state => ({
  players: state.gameState.players || {},
  terminated: state.gameState.terminated,
  victor: state.gameState.victor,
}))(PlayingPage);
