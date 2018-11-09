import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {defaultMemoize} from 'reselect';
import _ from 'lodash';
import cx from 'classnames';

import {getCoursesByCode} from 'reducers/courses';
import {
    getSelectedCourses,
    selectCourse,
    removeCourse,
    getSchedules
} from 'reducers/schedule';

import CourseSearch from 'components/CourseSearch'
import WeekCalendar from 'components/WeekCalendar';
import Card from 'components/Card';
import Course, {computeEvents} from 'components/Course';

import './ScheduleView.scss';

@connect(
    (state) => ({
        courses: getCoursesByCode(state),
        selectedCourses: getSelectedCourses(state),
        schedules: getSchedules(state)
    }),
    (dispatch) => bindActionCreators({
        selectCourse,
        removeCourse
    }, dispatch)
)
class ScheduleView extends PureComponent {
    constructor() {
        super();

        this.state = {
            searched: []
        };
    }

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
        const { courses, selectedCourses, schedules } = this.props;
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
                            <Course data={courses[code]} mini={true} key={code}/>
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
                    events={this.getEventsForSchedule(_.values(schedules)[0])}
                />

                <Card className='schedules'>
                    <h3>Schedules</h3>
                </Card>
            </div>
        )
    }
}

export default ScheduleView;
