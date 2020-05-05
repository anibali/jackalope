import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AbstractJoinPage from './AbstractJoinPage';


const CreatePrivatePage = ({ gameClient }) => {
  let { numPlayers } = useParams();
  numPlayers = parseInt(numPlayers, 10);

  const joinFunction = useCallback(
    () => gameClient.create('game_room', { numPlayers, unlisted: true }),
    [gameClient],
  );

  return (
    <AbstractJoinPage joinFunction={joinFunction} />
  );
};


export default CreatePrivatePage;
