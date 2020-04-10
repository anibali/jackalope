import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import dispatchJoinRoom from '../actions/joinRoom';
import RoomContext from '../RoomContext';


const AbstractJoinPage = ({ joinFunction, joinRoom }) => {
  const [room, setRoom] = useContext(RoomContext);
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [joinError, setJoinError] = useState(false);

  useEffect(() => {
    if(room == null && !joiningRoom) {
      setJoiningRoom(true);
      joinFunction.then(newRoom => {
        joinRoom(newRoom);
        setRoom(newRoom);
      }).catch(err => {
        console.error('JOIN ERROR', err);
        setJoinError(true);
      });
    }
  });

  if(room != null) {
    return <Redirect to="/playing" />;
  }

  if(joinError) {
    return (
      <div>
        Could not join room.
      </div>
    );
  }

  return (
    <div>
      Joining a game...
    </div>
  );
};


export default connect(
  null,
  dispatch => ({
    joinRoom: room => dispatchJoinRoom(dispatch, room),
  })
)(AbstractJoinPage);
