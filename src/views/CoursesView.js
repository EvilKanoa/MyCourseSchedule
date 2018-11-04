import React, {PureComponent} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {
    getCourses,
    getError,
    isLoading,
    fetchCourses
} from 'reducers/courses';

import Card from 'components/Card';

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
                <h1> Courses </h1>
                {this.props.loading ?
                    <h2> Loading... </h2> :
                    <Card>
                        {this.props.error ? 'Failed' : 'Succeeded'}
                        <pre>
                            {this.props.error || JSON.stringify(this.props.courses, null, 4)}
                        </pre>
                    </Card>
                }
            </div>
        )
    }
}

export default CoursesView;
