import {createSelector} from 'reselect';
import _ from 'lodash';
import {errorHandler, corsEscape, urlencode} from 'util/fetchUtils';

const webadvisor = (token = '') =>
    `https://webadvisor.uoguelph.ca/WebAdvisor/WebAdvisor?CONSTITUENCY=WBST&type=P&pid=ST-WESTS12A&TOKENIDX=${token}`;

const initialState = {
    courses: [],
    raw: '',
    loading: false,
    parsing: true,
    error: '',
    term: 'W19',
    webadvisorToken: '',
};

// base selectors
export const getState = (state) => state.courses;
export const getCourses = (state) => getState(state).courses;
export const getRaw = (state) => getState(state).raw;
export const isLoading = (state) => getState(state).loading;
export const getError = (state) => getState(state).error;
export const getTerm = (state) => getState(state).term;
export const isFailed = (state) => !!getError(state);
export const getWebadvisorToken = (state) => getState(state).webadvisorToken;

// computed selectors
export const getCoursesByCode = createSelector(
    [getCourses],
    (courses) => _.keyBy(courses, 'code')
);

// action-creators
const beginCourseFetch = () => ({
    type: 'BEGIN_COURSE_FETCH'
});

const courseFetchSucceeded = (raw = '') => ({
    type: 'COURSE_FETCH_SUCCEEDED',
    data: raw
});

const courseFetchFailed = (err) => ({
    type: 'COURSE_FETCH_FAILED',
    err
});

const beginCourseParse = () => ({
    type: 'BEGIN_COURSE_PARSE'
});

const courseParseSucceeded = (courses = []) => ({
    type: 'COURSE_PARSE_SUCCEEDED',
    data: courses
});

const courseParseFailed = (err) => ({
    type: 'COURSE_PARSE_FAILED',
    err
});

export const setWebadvisorToken = (token) => ({
    type: 'SET_WEBADVISOR_TOKEN',
    data: token
});

export const fetchCourses = () => async (dispatch, getState) => {
    dispatch(beginCourseFetch());

    try {
        let res = await fetch(corsEscape(webadvisor())).then(errorHandler);
        let cookies = res.headers.get('x-forwarded-cookies');
        const token = JSON.parse(cookies)['LASTTOKEN'] || '';
        dispatch(setWebadvisorToken(token));
        if (!token) {
            throw Error('Failed to retrieve token from webadvisor');
        }

        res = await fetch(
            corsEscape(webadvisor(token)),
            {
                credentials: 'omit',
                headers: {
                    'x-append-cookies': cookies
                }
            }
        ).then(errorHandler);
        cookies = res.headers.get('x-forwarded-cookies');

        const postData = {
            'VAR1': getTerm(getState()),
            'VAR10': 'Y', 'VAR11': 'Y', 'VAR12': 'Y', 'VAR13': 'Y', 'VAR14': 'Y', 'VAR15': 'Y', 'VAR16': 'Y',
            'DATE.VAR1': '', 'DATE.VAR2': '', 'LIST.VAR1_CONTROLLER': 'LIST.VAR1',
            'LIST.VAR1_MEMBERS': 'LIST.VAR1*LIST.VAR2*LIST.VAR3*LIST.VAR4', 'LIST.VAR1_MAX': '5', 'LIST.VAR2_MAX': '5',
            'LIST.VAR3_MAX': '5', 'LIST.VAR4_MAX': '5', 'LIST.VAR1_1': '', 'LIST.VAR2_1': '', 'LIST.VAR3_1': '',
            'LIST.VAR4_1': '', 'LIST.VAR1_2': '', 'LIST.VAR2_2': '', 'LIST.VAR3_2': '', 'LIST.VAR4_2': '',
            'LIST.VAR1_3': '', 'LIST.VAR2_3': '', 'LIST.VAR3_3': '', 'LIST.VAR4_3': '', 'LIST.VAR1_4': '',
            'LIST.VAR2_4': '', 'LIST.VAR3_4': '', 'LIST.VAR4_4': '', 'LIST.VAR1_5': '', 'LIST.VAR2_5': '',
            'LIST.VAR3_5': '', 'LIST.VAR4_5': '', 'VAR7': '', 'VAR8': '', 'VAR3': '', 'VAR6': '', 'VAR21': '',
            'VAR9': '', 'SUBMIT_OPTIONS': ''
        };
        res = await fetch(
            corsEscape(`https://webadvisor.uoguelph.ca/WebAdvisor/WebAdvisor?TOKENIDX=${token}&SS=1&APP=ST&CONSTITUENCY=WBST`),
            {
                method: 'post',
                credentials: 'omit',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-append-cookies': cookies,
                    'x-ignore-redirects': 'true'
                },
                body: urlencode(postData)
            }
        );
        cookies = res.headers.get('x-forwarded-cookies');

        res = await fetch(
            corsEscape(`https://webadvisor.uoguelph.ca/WebAdvisor/WebAdvisor?TOKENIDX=${token}&SS=2&APP=ST&CONSTITUENCY=WBST`),
            {
                credentials: 'omit',
                headers: {
                    'x-append-cookies': cookies
                }
            }
        ).then(errorHandler);

        let data = await res.text();
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
            raw: action.data,
            loading: false,
            error: ''
        };

        case 'COURSE_FETCH_FAILED': return {
            ...state,
            raw: '',
            loading: false,
            error: action.err
        };

        case 'BEGIN_COURSE_PARSE': return {
            ...state,
            parsing: true,
            error: ''
        };

        case 'COURSE_PARSE_SUCCEEDED': return {
            ...state,
            courses: action.data,
            parsing: false,
            error: ''
        };

        case 'COURSE_PARSE_FAILED': return {
            ...state,
            courses: [],
            parsing: false,
            error: action.err
        };

        case 'SET_WEBADVISOR_TOKEN': return {
            ...state,
            webadvisorToken: action.data
        };

        default: return {
            ...state
        };
    }
};
