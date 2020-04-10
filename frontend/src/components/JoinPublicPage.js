import React, { useCallback } from 'react';
import AbstractJoinPage from './AbstractJoinPage';


const JoinPublicPage = ({ gameClient }) => {
  const joinFunction = useCallback(
    () => gameClient.joinOrCreate('game_2p_room', { private: false }),
    [gameClient],
  );

  return (
    <AbstractJoinPage joinFunction={joinFunction} />
  );
};


export default JoinPublicPage;
