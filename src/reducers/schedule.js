import {createSelector} from 'reselect';
import _ from 'lodash';

import Storage from 'core/storage';
import {getCoursesByCode} from 'reducers/courses';

const initialState = Storage.getScheduleState() || {
    selected: [],
};

// base selectors
export const getState = (state) => state.schedule;
export const getSelectedCourses = (state) => getState(state).selected;

// computed selectors
export const getSchedules = createSelector(
    [getCoursesByCode, getSelectedCourses],
    (courses, selected) => [_.flatMap(selected,
        (code) => _.map(courses[code].sections[0].meetings, (meeting) => ({
            ...meeting,
            course: code,
            section: courses[code].sections[0].sectionId
        }))
    )]
);

// action-creators
export const setSelectedCourses = (selected = []) => ({
    type: 'SET_SELECTED_COURSES',
    data: selected
});

export const selectCourse = (courses = []) => ({
    type: 'ADD_SELECTED_COURSES',
    data: _.isArray(courses) ? courses : [courses]
});

export const removeCourse = (courses = []) => ({
    type: 'REMOVE_SELECTED_COURSES',
    data: _.isArray(courses) ? courses : [courses]
});

// reducer
const reducer = (state = initialState, { type, ...action }) => {
    switch (type) {
        case 'SET_SELECTED_COURSES': return {
            ...state,
            selected: action.data
        };

        case 'ADD_SELECTED_COURSES': return {
            ...state,
            selected: _.uniq([...state.selected, ...action.data])
        };

        case 'REMOVE_SELECTED_COURSES': return {
            ...state,
            selected: _.differenceBy(state.selected, action.data)
        };

        default: return {
            ...state
        };
    }
};

export default (state, action) => {
    const newState = reducer(state, action);
    Storage.updateSchedule(newState);
    return newState;
};
