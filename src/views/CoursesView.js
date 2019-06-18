import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import cx from 'classnames';

import { getCourses, getError, isLoading } from 'reducers/courses';

import {
  FaCaretUp as CaretUpIcon,
  FaCaretDown as CaretDownIcon,
} from 'react-icons/fa';
import Paginate from 'react-paginate';
import Course from 'components/Course';
import Card from 'components/Card';
import CourseSearch from 'components/CourseSearch';

import './CoursesView.scss';

const PAGE_ITEM_COUNT = 10;

@connect(state => ({
  courses: getCourses(state),
  loading: isLoading(state),
  error: getError(state),
}))
class CoursesView extends PureComponent {
  constructor() {
    super();

    this.state = {
      courses: [],
      page: 0,
      sort: {
        code: { weight: 0.25, direction: 'asc' },
        name: false,
        credits: false,
        location: false,
      },
    };
  }

  updateCourses = courses => {
    this.setState({
      courses,
      page: 0,
    });
  };

  pageChange = pageData => {
    this.setState({
      page: pageData.selected,
    });
  };

  sortClick = field => {
    const direction = this.state.sort[field]
      ? this.state.sort[field].direction === 'asc'
        ? 'desc'
        : 'asc'
      : 'asc';
    this.setState({
      sort: {
        code: field === 'code' && { weight: 0.25, direction },
        name: field === 'name' && { weight: 0.25, direction },
        credits: field === 'credits' && { weight: 0.25, direction },
        location: field === 'location' && { weight: 0.25, direction },
      },
    });
  };

  getSortElement = (field, label) => (
    <div
      className={cx('course-sort-option', {
        selected: this.state.sort[field],
      })}
      onClick={() => this.sortClick(field)}
      key={field}
    >
      {label}
      <span className="caret">
        {this.state.sort[field] &&
        this.state.sort[field].direction === 'desc' ? (
          <CaretDownIcon />
        ) : (
          <CaretUpIcon />
        )}
      </span>
    </div>
  );

  render() {
    const { page, courses, sort } = this.state;

    return (
      <div id="view-courses">
        <CourseSearch
          className="course-filter"
          placeholder="Filter courses..."
          onChange={this.updateCourses}
          engine="search"
          sort={sort}
        />

        <div className="course-sort">
          {this.getSortElement('code', 'Code')}
          {this.getSortElement('name', 'Name')}
          {this.getSortElement('credits', 'Credits')}
          {this.getSortElement('location', 'Location')}
        </div>

        {_.map(
          courses.slice(PAGE_ITEM_COUNT * page, PAGE_ITEM_COUNT * (page + 1)),
          course =>
            course &&
            course.code && (
              <Card className="course-card" key={course.code}>
                <Course data={course} calendar={true} />
              </Card>
            ),
        )}

        <Paginate
          containerClassName="pagination"
          pageClassName="pagination-item"
          activeClassName="selected"
          previousLabel="<"
          nextLabel=">"
          onPageChange={this.pageChange}
          pageCount={_.ceil(courses.length / PAGE_ITEM_COUNT)}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          forcePage={page}
        />
      </div>
    );
  }
}

export default CoursesView;
