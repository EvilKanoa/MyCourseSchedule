import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import Routes from 'core/routes';
import store from 'core/store';

import 'index.scss';

window.getState = store.getState;

render(
  <Provider store={store}>{Routes}</Provider>,
  document.getElementById('root')
);
