import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';

import routes from 'core/routes';
import store from 'core/store';

import 'index.scss';

window.getState = store.getState;

render(
    <Provider store={store}>
        {routes}
    </Provider>,
    document.getElementById('root')
);
