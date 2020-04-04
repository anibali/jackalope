import React from 'react';
import { Provider } from 'react-redux';


const ClientRoot = ({ store }) => (
  <Provider store={store}>
    <div>
      This is the ClientRoot component.
    </div>
  </Provider>
);


export default ClientRoot;
