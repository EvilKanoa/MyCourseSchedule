import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {
    getCourses,
    getError,
    isLoading
} from 'reducers/courses';

import Paginate from 'react-paginate';
import Course from 'components/Course';
import Card from 'components/Card';
import CourseSearch from 'components/CourseSearch';

import './CoursesView.scss';

const PAGE_ITEM_COUNT = 10;

@connect(
    (state) => ({
        courses: getCourses(state),
        loading: isLoading(state),
        error: getError(state)
    })
)
class CoursesView extends PureComponent {
    constructor() {
        super();

        this.state = {
            courses: [],
            page: 0,
        };
    }

    updateCourses = (courses) => {
        this.setState({
            courses,
            page: 0,
        });
    };

    pageChange = (pageData) => {
        this.setState({
            page: pageData.selected
        });
    };

    render() {
        const { page, courses } = this.state;

        return (
            <div id='view-courses'>
                <CourseSearch
                    className='course-filter'
                    placeholder='Filter courses...'
                    onChange={this.updateCourses}
                    engine='search'
                />

                { _.map(courses.slice(PAGE_ITEM_COUNT * page, PAGE_ITEM_COUNT * (page + 1)), (course) =>
                    course && course.code && (
                        <Card className='course-card' key={course.code}>
                            <Course data={course} calendar={true}/>
                        </Card>
                    )
                ) }

                <Paginate
                    containerClassName='pagination'
                    pageClassName='pagination-item'
                    activeClassName='selected'
                    previousLabel='<'
                    nextLabel='>'
                    onPageChange={this.pageChange}
                    pageCount={_.ceil(courses.length / PAGE_ITEM_COUNT)}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    forcePage={page}
                />
            </div>
        )
    }
}

export default CoursesView;
