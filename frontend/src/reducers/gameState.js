import { createSlice } from '@reduxjs/toolkit';

const initialState = {};


const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    changeGameState(state, action) {
      state[action.payload.field] = action.payload.value;
    },
    clearGameState() {
      return initialState;
    },
  }
});

export const { changeGameState, clearGameState } = gameStateSlice.actions;
export default gameStateSlice.reducer;
