import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {defaultMemoize} from 'reselect';
import _ from 'lodash';
import cx from 'classnames';

import {getCoursesByCode} from 'reducers/courses';
import {
    selectCourse,
    removeCourse,
    selectSection,
    selectSchedule,
    getSelectedCourses,
    getSchedules,
    getSelectedSchedule,
    getSelectedSections
} from 'reducers/schedule';

import WeekCalendar from 'components/WeekCalendar';
import MiniSchedule from 'components/MiniSchedule';
import CourseSearch from 'components/CourseSearch'
import Card from 'components/Card';
import Course, {computeEvents} from 'components/Course';

import './ScheduleView.scss';

const COURSE_PALETTE = [
  '#F0B27A',
  '#F7DC6F',
  '#82E088',
  '#85C1E9',
  '#BB8FCE',
  '#BFC9CA',
  '#00FFFF',
  '#00FF00',
  '#FF00FF',
  '#FFFF00'
];

@connect(
    (state) => ({
        courses: getCoursesByCode(state),
        selectedCourses: getSelectedCourses(state),
        schedules: getSchedules(state),
        selectedSchedule: getSelectedSchedule(state),
        selectedSections: getSelectedSections(state)
    }),
    (dispatch) => bindActionCreators({
        selectCourse,
        removeCourse,
        selectSection,
        selectSchedule
    }, dispatch)
)
class ScheduleView extends PureComponent {
    constructor() {
        super();

        this.state = {
            searched: [],
            prevSelectedSchedule: undefined
        };
    }

    getMiniSchedules = defaultMemoize((schedules, selectedScheduleId) =>
        _.map(_.take(_.values(schedules), 50), (schedule) => (
            <MiniSchedule
                schedule={schedule}
                selected={selectedScheduleId === schedule.id}
                onClick={({ id }) => {
                    this.props.selectSchedule(id);
                }}
                key={schedule.id}
            />
        ))
    );

    getEventsForSchedule = defaultMemoize(({ meetings }) =>
        _.map(computeEvents(meetings, ({ type }) => type), (meeting) => ({
            ...meeting,
            content: (
                <div className='course-meeting'>
                    <p>{ meeting.course }*{ meeting.section }</p>
                    <p>{ meeting.content }</p>
                    <p>{ meeting.location }</p>
                </div>
            )
        }))
    );

    getCourseColours = defaultMemoize(selectedCourses =>
        _.reduce(selectedCourses, (acc, code, idx) => {
            acc[code] = COURSE_PALETTE[idx % COURSE_PALETTE.length];
            return acc;
        }, {})
    );

    selectSectionButtonRenderer = (course) => ({ id }) => (
        <div
            className='select-section-button button'
            key={`${course}*${id}`}
            onClick={() => {
                this.props.selectSection(`${course}*${id}`);
            }}
        >
            Select { id }
        </div>
    );

    onSectionClick = (course) => (id) => {
        this.setState({ prevSelectedSchedule: undefined });
        this.props.selectSection(`${course}*${id}`);
    }

    onSectionMouseOver = (course) => (id) => {
        const fullId = `${course}*${id}`;
        if (!this.state.prevSelectedSchedule &&
            !this.props.selectedSections.includes(fullId)
        ) {
            this.setState({
                prevSelectedSchedule: this.props.selectedSchedule.id,
                hightlightSections: [
                    fullId,
                    _.find(this.props.selectedSections,
                        (sectionId) => sectionId.startsWith(course)
                    )
                ]
            });
        }
        this.props.selectSection(`${course}*${id}`);
    }

    onSectionMouseOut = (course) => (id) => {
        const { prevSelectedSchedule } = this.state;
        if (prevSelectedSchedule) {
            this.setState({ prevSelectedSchedule: undefined });
            this.props.selectSchedule(prevSelectedSchedule);
        }
    }

    updateCourses = (searched) => {
        this.setState({
            searched
        });
    };

    toggleSelectedCourse = (code) => {
        if (this.props.selectedCourses.includes(code)) {
            this.props.removeCourse(code);
        } else {
            this.props.selectCourse(code);
        }
    };

    overlaps = (event, events) =>
        _.some(events, other => other.course !== event.course
            && other.day === event.day
            && (
                (event.start >= other.start && event.start <= other.end) ||
                (event.end >= other.start && event.end <= other.end)
              )
        );

    eventRenderer = (event, day, events) => (
        <div
            className='default-calendar-event calendar-event'
            style={this.overlaps(event, events) ? {
                backgroundColor:
                    this.getCourseColours(this.props.selectedCourses)[event.course],
                opacity: '0.25'
            } : {
                backgroundColor:
                    this.getCourseColours(this.props.selectedCourses)[event.course]
            }}
        >
            { event.content }
        </div>
    )

    render() {
        const {
            courses,
            selectedCourses,
            schedules,
            selectedSchedule,
            selectedSections
        } = this.props;
        const {
            searched,
            prevSelectedSchedule,
            hightlightSections
        } = this.state;

        return (
            <div id='view-schedule'>
                <Card className='courses'>
                    <h3>Selected Courses</h3>

                    <Card className='add-course-card'>
                        <CourseSearch
                            className='add-course-search'
                            placeholder='Add course...'
                            onChange={this.updateCourses}
                            allowEmpty={false}
                        />

                        { !!searched.length &&
                        <div className='add-course-results'>
                            { _.map(_.take(searched, 8), (course) => (
                                <div
                                    className={cx('add-course-result-item', {
                                        selected: selectedCourses.includes(course.code)
                                    })}
                                    onClick={() => this.toggleSelectedCourse(course.code)}
                                    key={course.code}
                                >
                                    {`${course.code} ${course.name}`}
                                </div>
                            )) }
                        </div>
                        }
                    </Card>

                    { _.map(selectedCourses, (code) => (
                        <div
                            className='selected-course'
                            key={code}
                        >
                            <div
                                className='remove-button'
                                onClick={() => this.toggleSelectedCourse(code)}
                            >
                                Remove
                            </div>
                            <Course
                                data={courses[code]}
                                mini={true}
                                key={code}
                                titleStyle={{
                                    backgroundColor:
                                        this.getCourseColours(selectedCourses)[code]
                                }}
                                selectedSections={selectedSections}
                                sectionElementRenderer={this.selectSectionButtonRenderer(code)}
                                onSectionClick={this.onSectionClick(code)}
                                onSectionMouseOver={this.onSectionMouseOver(code)}
                                onSectionMouseOut={this.onSectionMouseOut(code)}
                                highlightSections={prevSelectedSchedule && hightlightSections}
                            />
                        </div>
                    )) }
                </Card>

                <WeekCalendar
                    className='schedule'
                    days={5}
                    start={8 * 60}
                    end={21.5 * 60}
                    interval={30}
                    weekStart={'monday'}
                    events={this.getEventsForSchedule(selectedSchedule)}
                    eventRenderer={this.eventRenderer}
                />

                <Card className='schedules'>
                    <h3>Schedules</h3>

                    { this.getMiniSchedules(schedules, selectedSchedule.id) }
                </Card>
            </div>
        )
    }
}

export default ScheduleView;
