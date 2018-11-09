import {createSelector} from 'reselect';
import _ from 'lodash';

import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import flatten from 'lodash/fp/flatten';
import keyBy from 'lodash/fp/keyBy';
import sortBy from 'lodash/fp/sortBy';
import join from 'lodash/fp/join';

import Storage from 'core/storage';
import {getCoursesByCode, getTerm} from 'reducers/courses';

const initialState = Storage.getScheduleState() || {
    selected: [],
};

// base selectors
export const getState = (state) => state.schedule;
export const getSelectedCourses = (state) => getState(state).selected;

// computed selectors
export const getSchedules = createSelector(
    [getCoursesByCode, getSelectedCourses, getTerm],
    (courses, selected, term) => flow(
        map(code => courses[code]),
        map(course => ({
            ...course,
            sections: flow(
                map(section => ({
                    ...section,
                    course: course.code,
                    meetings: flow(
                        map(meeting => ({
                            ...meeting,
                            course: course.code,
                            section: section.sectionId
                        }))
                    )(section.meetings)
                }))
            )(course.sections)
        })),
        map(course => course.sections),
        reduce(
            (schedules, sections) => flow(
                map(result => flow(
                    map(section => [...result, section])
                )(sections)),
                flatten
            )(schedules),
            [[]]
        ),
        map(sections => ({
            sections,
            meetings: flow(
                map(section => section.meetings),
                flatten
            )(sections),
            id: `${term},${flow(
                map(section => `${section.course}*${section.sectionId}`),
                sortBy(str => str),
                join(',')
            )(sections)}`
        })),
        sortBy(schedule => schedule.id),
        keyBy(schedule => schedule.id)
    )(selected)
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
