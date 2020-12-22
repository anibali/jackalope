import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { ErrorCode } from 'colyseus.js';
import { Button } from 'react-bootstrap';
import RoomContext from '../RoomContext';
import { changeGameState, clearGameState } from '../reducers/gameState';
import { setRoomInfo } from '../reducers/roomInfo';


const REGULAR_SOCKET_SHUTDOWN = 1000;


const toPlainData = (data) => {
  if(Array.isArray(data)) {
    return [...data.map(toPlainData)];
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


const AbstractJoinPage = ({ joinFunction, joinRoom }) => {
  const [room, setRoom] = useContext(RoomContext);
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [joinError, setJoinError] = useState(null);

  useEffect(() => {
    if(room == null && !joiningRoom) {
      setJoiningRoom(true);
      joinFunction().then(newRoom => {
        joinRoom(newRoom, setRoom);
      }).catch(err => {
        console.error('Join error:', err.message);
        if(err == null) {
          err = Error('unknown error');
        }
        setJoinError(err);
      });
    }
  });

  if(room != null) {
    return <Redirect to="/playing" />;
  }

  if(joinError != null) {
    let message = '';
    switch(joinError.code) {
      case ErrorCode.MATCHMAKE_NO_HANDLER:
        message = 'The requested type of room is not defined.';
        break;
      case ErrorCode.MATCHMAKE_INVALID_CRITERIA:
        message = 'No rooms match the provided criteria';
        break;
      case ErrorCode.MATCHMAKE_INVALID_ROOM_ID:
        message = 'Either the room is locked or does not exist.';
        break;
      case ErrorCode.MATCHMAKE_UNHANDLED:
        message = 'Server-side room handling error.';
        break;
      case ErrorCode.MATCHMAKE_EXPIRED:
        message = 'The session has expired.';
        break;
      default:
        message = 'The reason is unknown.';
    }
    return (
      <div>
        <p>Could not join the room.</p>
        <p>{message}</p>
        <Button as={Link} to="/">Back to Home</Button>
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
    joinRoom: (room, setRoom) => {
      dispatch(setRoomInfo({ sessionId: room.sessionId, roomId: room.id }));
      room.state.onChange = (changes) => {
        changes.forEach(change => {
          const value = toPlainData(change.value);
          dispatch(changeGameState({ field: change.field, value }));
        });
      };
      room.onLeave(code => {
        dispatch(clearGameState());
        if(code === REGULAR_SOCKET_SHUTDOWN) {
          dispatch(setRoomInfo({ sessionId: null, roomId: null }));
        }
        setRoom(null);
      });
      dispatch(setRoomInfo({ sessionId: room.sessionId, roomId: room.id }));
      setRoom(room);
    },
  })
)(AbstractJoinPage);
