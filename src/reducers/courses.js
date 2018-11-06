import {createSelector} from 'reselect';
import _ from 'lodash';
import {errorHandler, jsonHandler} from 'util/fetchUtils';

const initialState = {
    courses: [],
    loading: false,
    error: '',
    term: 'W19',
};

// base selectors
export const getState = (state) => state.courses;
export const getCourses = (state) => getState(state).courses;
export const isLoading = (state) => getState(state).loading;
export const getError = (state) => getState(state).error;
export const getTerm = (state) => getState(state).term;

// computed selectors
export const getCoursesByCode = createSelector(
    [getCourses],
    (courses) => _.keyBy(courses, 'code')
);

// action-creators
const beginCourseFetch = () => ({
    type: 'BEGIN_COURSE_FETCH'
});

const courseFetchSucceeded = (courses = []) => ({
    type: 'COURSE_FETCH_SUCCEEDED',
    data: courses
});

const courseFetchFailed = (err) => ({
    type: 'COURSE_FETCH_FAILED',
    err
});

export const fetchCourses = () => async (dispatch, getState) => {
    dispatch(beginCourseFetch());

    try {
        const data = await fetch(`${process.env.WEBADVISOR_API}courses/${getTerm(getState())}`)
            .then(errorHandler)
            .then(jsonHandler);
        dispatch(courseFetchSucceeded(data));
        return data;
    } catch (err) {
        dispatch(courseFetchFailed(err.message));
    }
};

// reducer
export default (state = initialState, { type, ...action }) => {
    switch (type) {
        case 'BEGIN_COURSE_FETCH': return {
            ...state,
            loading: true,
            error: ''
        };

        case 'COURSE_FETCH_SUCCEEDED': return {
            ...state,
            courses: action.data,
            loading: false,
            error: ''
        };

        case 'COURSE_FETCH_FAILED': return {
            ...state,
            courses: [],
            loading: false,
            error: action.err
        };

        default: return {
            ...state
        };
    }
};
