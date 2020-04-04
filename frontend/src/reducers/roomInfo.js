import { createSlice } from '@reduxjs/toolkit';


const roomInfoSlice = createSlice({
  name: 'roomInfo',
  initialState: {},
  reducers: {
    setRoomInfo(state, action) {
      state.sessionId = action.payload.sessionId;
      state.roomId = action.payload.roomId;
    },
  }
});

export const { setRoomInfo } = roomInfoSlice.actions;
export default roomInfoSlice.reducer;
