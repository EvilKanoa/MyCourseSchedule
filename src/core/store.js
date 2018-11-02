import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import rootReducer from 'reducers';

let middleware = applyMiddleware(thunk);
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    middleware = compose(middleware, window.__REDUX_DEVTOOLS_EXTENSION__());
}

const store = createStore(rootReducer, middleware);

export default store;
