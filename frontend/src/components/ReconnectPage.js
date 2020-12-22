import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AbstractJoinPage from './AbstractJoinPage';


const ReconnectPage = ({ gameClient }) => {
  const { roomId, sessionId } = useParams();

  const joinFunction = useCallback(
    () => gameClient.reconnect(roomId, sessionId),
    [gameClient, roomId, sessionId],
  );

  return (
    <AbstractJoinPage joinFunction={joinFunction} />
  );
};


export default ReconnectPage;
