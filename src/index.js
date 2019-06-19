import React from 'react';
import { render } from 'react-dom';
import { ClientContext as GraphQLContext } from 'graphql-hooks';
import { Provider as ReduxProvider } from 'react-redux';

import routes from 'core/routes';
import store from 'core/store';
import graphql from 'core/graphql';

import 'index.scss';

window.getState = store.getState;

render(
  <ReduxProvider store={store}>
    <GraphQLContext.Provider value={graphql}>{routes}</GraphQLContext.Provider>
  </ReduxProvider>,
  document.getElementById('root'),
);
