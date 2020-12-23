import React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import { PureHand } from '../src/components/Hand';
import RoomContext from '../src/RoomContext';


export default { title: 'Hand' };

export const withNoCards = () => (
  <RoomContext.Provider value={[null, () => {}]}>
    <DndProvider backend={Backend} options={HTML5toTouch}>
      <PureHand handNumbers={[]} chip={0} />
    </DndProvider>
  </RoomContext.Provider>
);

export const withSevenCards = () => (
  <RoomContext.Provider value={[null, () => {}]}>
    <DndProvider backend={Backend} options={HTML5toTouch}>
      <PureHand handNumbers={[54, 28, 82, 90, 2, 15, 14]} chip={0} />
    </DndProvider>
  </RoomContext.Provider>
);
