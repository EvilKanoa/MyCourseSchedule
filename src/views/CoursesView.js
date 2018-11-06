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
                    <Card>
                        <h3>
                            {
                                this.props.loading ?
                                    'Loading' :
                                    (this.props.error ?
                                        'Failed' :
                                        'Succeeded'
                                    )
                            }
                        </h3>
                        <pre>
                            {this.props.error || '' }
                        </pre>
                        <pre>
                            { JSON.stringify(this.props.courses, null, 4) }
                        </pre>
                    </Card>
            </div>
        )
    }
}

export default CoursesView;
