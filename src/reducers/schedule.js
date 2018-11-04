import {createSelector} from 'reselect';
import _ from 'lodash';

const initialState = {
    selected: [],
};

// base selectors
export const getState = (state) => state.schedule;
export const getCourses = (state) => getState(state).selected;

// computed selectors

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
export default (state = initialState, { type, ...action }) => {
    switch (type) {
        case 'SET_SELECTED_COURSES': return {
            ...state,
            selected: action.data
        };

        case 'ADD_SELECTED_COURSES': return {
            ...state,
            selected: _.uniqBy([...state.selected, ...action.data], 'code')
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
