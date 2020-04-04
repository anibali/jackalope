import { createSlice } from '@reduxjs/toolkit';


const gameStateSlice = createSlice({
  name: 'gameState',
  initialState: {},
  reducers: {
    changeGameState(state, action) {
      state[action.payload.field] = action.payload.value;
    },
  }
});

export const { changeGameState } = gameStateSlice.actions;
export default gameStateSlice.reducer;
