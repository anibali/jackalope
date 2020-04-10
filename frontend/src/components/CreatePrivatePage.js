import React, { useCallback } from 'react';
import AbstractJoinPage from './AbstractJoinPage';


const CreatePrivatePage = ({ gameClient }) => {
  const joinFunction = useCallback(
    () => gameClient.create('game_2p_room', { private: true }),
    [gameClient],
  );

  return (
    <AbstractJoinPage joinFunction={joinFunction} />
  );
};


export default CreatePrivatePage;
