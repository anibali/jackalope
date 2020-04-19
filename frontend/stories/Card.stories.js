import React from 'react';
import Card from '../src/components/Card';

export default { title: 'Card' };


export const withNoProps = () => (
  <Card />
);


export const withPlayer1Chip = () => (
  <Card cardNumber={0} chip={0} />
);


export const withPlayer1SuperChip = () => (
  <Card cardNumber={0} chip={0} superChip />
);
