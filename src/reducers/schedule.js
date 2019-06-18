import { createSelector } from 'reselect';
import _ from 'lodash';

import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import flatten from 'lodash/fp/flatten';
import keyBy from 'lodash/fp/keyBy';
import sortBy from 'lodash/fp/sortBy';
import join from 'lodash/fp/join';

import Storage from 'core/storage';
import { getCoursesByCode, getTerm } from 'reducers/courses';

const initialState = {
  selectedCourses: [],
  selectedSchedule: '',
  ...Storage.getScheduleState(),
};

// base selectors
export const getState = state => state.schedule;
export const getSelectedCourses = state => getState(state).selectedCourses;
export const getSelectedScheduleId = state => getState(state).selectedSchedule;

// computed selectors
export const getSchedules = createSelector(
  [getCoursesByCode, getSelectedCourses, getTerm],
  (courses, selected, term) =>
    flow(
      map(code => courses[code]),
      map(course => ({
        ...course,
        sections: flow(
          map(section => ({
            ...section,
            id: `${course.code}*${section.id}`,
            course: course.code,
            meetings: flow(
              map(meeting => ({
                ...meeting,
                course: course.code,
                section: section.id,
              })),
            )(section.meetings),
          })),
        )(course.sections),
      })),
      map(course => course.sections),
      reduce(
        (schedules, sections) =>
          flow(
            map(result => flow(map(section => [...result, section]))(sections)),
            flatten,
          )(schedules),
        [[]],
      ),
      map(sections => ({
        sections,
        meetings: flow(
          map(section => section.meetings),
          flatten,
        )(sections),
        id: `${term},${flow(
          map(section => section.id),
          sortBy(id => id),
          join(','),
        )(sections)}`,
      })),
      sortBy(schedule => schedule.id),
      keyBy(schedule => schedule.id),
    )(selected),
);

export const getSelectedSchedule = createSelector(
  [getSchedules, getSelectedScheduleId],
  (schedules, scheduleId) =>
    schedules[scheduleId] ||
    (_.keys(schedules).length && schedules[_.keys(schedules)[0]]) ||
    undefined,
);

export const getSelectedSections = createSelector(
  [getSelectedSchedule],
  schedule => _.map(_.get(schedule, 'sections', []), 'id'),
);

// action-creators
export const selectCourse = (courses = []) => ({
  type: 'ADD_SELECTED_COURSES',
  data: _.isArray(courses) ? courses : [courses],
});

export const removeCourse = (courses = []) => ({
  type: 'REMOVE_SELECTED_COURSES',
  data: _.isArray(courses) ? courses : [courses],
});

export const selectSchedule = (scheduleId = '') => ({
  type: 'SET_SELECTED_SCHEDULE',
  data: scheduleId,
});

export const selectSection = id => (dispatch, getState) => {
  if (!id || !id.length) return;

  const course = _.join(_.take(id.split('*'), 2), '*');
  const scheduleId = getSelectedSchedule(getState()).id;
  if (!scheduleId || !scheduleId.length) return;

  const computedId = scheduleId.replace(
    new RegExp(`${course.replace('*', '\\*')}\\*[^,]*`),
    id,
  );
  if (!getSchedules(getState())[computedId]) return;

  dispatch(selectSchedule(computedId));
};

// reducer
const reducer = (state = initialState, { type, ...action }) => {
  switch (type) {
    case 'SET_SELECTED_COURSES':
      return {
        ...state,
        selectedCourses: action.data,
      };

    case 'ADD_SELECTED_COURSES':
      return {
        ...state,
        selectedCourses: _.uniq([...state.selectedCourses, ...action.data]),
      };

    case 'REMOVE_SELECTED_COURSES':
      return {
        ...state,
        selectedCourses: _.differenceBy(state.selectedCourses, action.data),
      };

    case 'SET_SELECTED_SCHEDULE':
      return {
        ...state,
        selectedSchedule: action.data,
      };

    default:
      return {
        ...state,
      };
  }
};

export default (state, action) => {
  const newState = reducer(state, action);
  Storage.updateSchedule(newState);
  return newState;
};
