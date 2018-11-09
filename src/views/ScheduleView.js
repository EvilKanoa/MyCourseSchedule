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
            searched: []
        };
    }

    getMiniSchedules = defaultMemoize((schedules, selectedScheduleId) =>
        _.map(schedules, (schedule) => (
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
                </div>
            )
        }))
    );

    selectSectionButtonRenderer = (course) => ({ sectionId }) => (
        <div
            className='select-section-button button'
            key={`${course}*${sectionId}`}
            onClick={() => {
                this.props.selectSection(`${course}*${sectionId}`);
            }}
        >
            Select { sectionId }
        </div>
    );

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

    render() {
        const {
            courses,
            selectedCourses,
            schedules,
            selectedSchedule,
            selectedSections
        } = this.props;
        const { searched } = this.state;

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
                        <div className='selected-course' key={code}>
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
                                selectedSections={selectedSections}
                                sectionElementRenderer={this.selectSectionButtonRenderer(code)}
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
