import React from 'react';
import { connect } from 'react-redux';


const TurnIndicator = ({ playerId, currentTurn }) => {
  if(currentTurn === playerId) {
    return <span>It&apos;s your turn, make a move!</span>;
  }
  return <span>Waiting for your turn...</span>;
};


export default connect(state => {
  const { currentTurn } = state.gameState;
  return { currentTurn };
})(TurnIndicator);
