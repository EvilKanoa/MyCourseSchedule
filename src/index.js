import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';

import * as Sentry from '@sentry/browser';

import Routes from 'core/routes';
import store from 'core/store';

import 'index.scss';

if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN
    });
}

window.getState = store.getState;

render(
    <Provider store={store}>
        {Routes}
    </Provider>,
    document.getElementById('root')
);
