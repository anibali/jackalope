import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AbstractJoinPage from './AbstractJoinPage';


const JoinPage = ({ gameClient }) => {
  const { roomId } = useParams();

  const joinFunction = useCallback(
    () => gameClient.joinById(roomId),
    [gameClient, roomId],
  );

  return (
    <AbstractJoinPage joinFunction={joinFunction} />
  );
};


export default JoinPage;
