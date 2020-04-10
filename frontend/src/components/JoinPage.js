import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import AbstractJoinPage from './AbstractJoinPage';


const JoinPage = ({ gameClient }) => {
  const { roomId } = useParams();

  const joinFunction = useMemo(
    () => gameClient.joinById(roomId),
    [gameClient, roomId],
  );

  return (
    <AbstractJoinPage joinFunction={joinFunction} />
  );
};


export default JoinPage;
