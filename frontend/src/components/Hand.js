import React, { useCallback, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { connect } from 'react-redux';
import HandStyles from '../styles/Hand.css';
import Card from './Card';


const HandCard = ({ cardNumber, chip, index, moveCard }) => {
  const ref = useRef();
  const [, drop] = useDrop({
    accept: 'card',
    hover(item, monitor) {
      if(!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves.
      if(dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen.
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get horizontal middle.
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position.
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the left.
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // Only change order when past the midpoint of the next item.
      if(dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      if(dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Do the reordering.
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'card', cardNumber, index },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  drag(drop(ref));
  return (
    <span className={isDragging ? HandStyles.Hidden : ''} ref={ref}>
      <Card cardNumber={cardNumber} chip={chip} />
    </span>
  );
};


const Hand = ({ hand, chip }) => {
  const [handOrder, setHandOrder] = useState([]);

  const handNumbers = [...hand.map(card => card.number)];
  handNumbers.sort((a, b) => {
    if(!handOrder.includes(a)) {
      return 1;
    }
    if(!handOrder.includes(b)) {
      return -1;
    }
    return handOrder.indexOf(a) < handOrder.indexOf(b) ? -1 : 1;
  });
  if(!handNumbers.every((e, i) => handOrder[i] === e)) {
    setHandOrder(handNumbers);
  }

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = handOrder[dragIndex];
      const newHandOrder = [...handOrder];
      newHandOrder.splice(dragIndex, 1);
      newHandOrder.splice(hoverIndex, 0, dragCard);
      setHandOrder(newHandOrder);
    },
    [handOrder],
  );

  const sortedHand = handOrder.map(number => (number == null ? -1 : number));

  return (
    <div>
      Your hand:
      <br />
      <div className={HandStyles.HandContainer}>
        {sortedHand.map(n => <HandCard key={n} cardNumber={n} chip={chip} index={handOrder.indexOf(n)} moveCard={moveCard} />)}
      </div>
    </div>
  );
};


export default connect(state => {
  const cards = state.gameState.cards || [];
  const playerId = state.roomInfo.sessionId;
  const hand = cards.filter(card => card.owner === playerId && !card.discarded);
  const chip = state.gameState.players[playerId].seatNumber;
  return { hand, chip };
})(Hand);
