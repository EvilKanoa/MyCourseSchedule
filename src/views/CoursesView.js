import React, {PureComponent} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';

import {
    getCourses,
    getError,
    isLoading,
    fetchCourses
} from 'reducers/courses';

import Course from 'components/Course';
import Card from 'components/Card';

import './CoursesView.scss';

@connect(
    (state) => ({
        courses: getCourses(state),
        loading: isLoading(state),
        error: getError(state)
    }),
    (dispatch) => bindActionCreators({
        fetchCourses
    }, dispatch)
)
class CoursesView extends PureComponent {
    componentDidMount() {
        this.props.fetchCourses();
    }

    render() {
        return (
            <div id='view-courses'>
                <h3>
                    {
                        this.props.loading ?
                            'Loading' :
                            (this.props.error ?
                                    'Failed' :
                                    'Succeeded'
                            )
                    }
                    :
                    { this.props.error }
                </h3>
                <h1> Courses </h1>
                { _.map([..._.take(this.props.courses, 20), _.find(this.props.courses, { code: 'CIS*1500'}) ], (course) =>
                    course && course.code && (
                        <Card className='course-card' key={course.code}>
                            <Course data={course}/>
                        </Card>
                    )
                ) }
            </div>
        )
    }
}

export default CoursesView;
