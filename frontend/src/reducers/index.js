import { combineReducers } from 'redux';

import gameState from './gameState';
import roomInfo from './roomInfo';


export default combineReducers({
  gameState,
  roomInfo,
});
