import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import RoomContext from '../RoomContext';
import { changeGameState, clearGameState } from '../reducers/gameState';
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


const AbstractJoinPage = ({ joinFunction, joinRoom }) => {
  const [room, setRoom] = useContext(RoomContext);
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [joinError, setJoinError] = useState(false);

  useEffect(() => {
    if(room == null && !joiningRoom) {
      setJoiningRoom(true);
      joinFunction().then(newRoom => {
        joinRoom(newRoom, setRoom);
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
    joinRoom: (room, setRoom) => {
      dispatch(setRoomInfo({ sessionId: room.sessionId, roomId: room.id }));
      room.state.onChange = (changes) => {
        changes.forEach(change => {
          const value = toPlainData(change.value);
          dispatch(changeGameState({ field: change.field, value }));
        });
      };
      room.onLeave(() => {
        dispatch(clearGameState());
        dispatch(setRoomInfo({ sessionId: null, roomId: null }));
        setRoom(null);
      });
      dispatch(setRoomInfo({ sessionId: room.sessionId, roomId: room.id }));
      setRoom(room);
    },
  })
)(AbstractJoinPage);
