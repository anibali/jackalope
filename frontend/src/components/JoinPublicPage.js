import React, { useMemo } from 'react';
import AbstractJoinPage from './AbstractJoinPage';


const JoinPublicPage = ({ gameClient }) => {
  const joinFunction = useMemo(
    () => gameClient.joinOrCreate('game_2p_room', { private: false }),
    [gameClient],
  );

  return (
    <AbstractJoinPage joinFunction={joinFunction} />
  );
};


export default JoinPublicPage;
