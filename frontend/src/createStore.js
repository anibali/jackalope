import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './reducers';


export default (preloadedState) => configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === 'development',
  preloadedState,
});
