import React from 'react';
import EasyCopyText from '../src/components/EasyCopyText';

export default { title: 'EasyCopyText' };

export const withText = () => (
  <EasyCopyText text="http://example.com" />
);
