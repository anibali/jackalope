export function saveRoomInfo({ roomId, sessionId }) {
  localStorage.setItem('roomId', roomId);
  localStorage.setItem('sessionId', sessionId);
}


export function loadRoomInfo() {
  const roomId = localStorage.getItem('roomId');
  const sessionId = localStorage.getItem('sessionId');
  if(!roomId || !sessionId) {
    return {};
  }
  return { roomId, sessionId };
}


export function clearRoomInfo() {
  localStorage.removeItem('sessionId');
  localStorage.removeItem('roomId');
}
