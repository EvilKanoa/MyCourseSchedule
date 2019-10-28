import { combineReducers } from 'redux';

import courses from 'reducers/courses';
import schedule from 'reducers/schedule';

const rootReducer = combineReducers({
  courses,
  schedule,
});

export default rootReducer;
