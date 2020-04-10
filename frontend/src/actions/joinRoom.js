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


export default (dispatch, room) => {
  dispatch(setRoomInfo({ sessionId: room.sessionId, roomId: room.id }));
  room.state.onChange = (changes) => {
    changes.forEach(change => {
      const value = toPlainData(change.value);
      dispatch(changeGameState({ field: change.field, value }));
    });
  };
  room.onLeave(() => {
    dispatch(clearGameState());
  });
};
