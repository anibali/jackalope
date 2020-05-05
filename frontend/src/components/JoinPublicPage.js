import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AbstractJoinPage from './AbstractJoinPage';


const JoinPublicPage = ({ gameClient }) => {
  let { numPlayers } = useParams();
  numPlayers = parseInt(numPlayers, 10);

  const joinFunction = useCallback(
    () => gameClient.joinOrCreate('game_room', { numPlayers, unlisted: false }),
    [gameClient],
  );

  return (
    <AbstractJoinPage joinFunction={joinFunction} />
  );
};


export default JoinPublicPage;
