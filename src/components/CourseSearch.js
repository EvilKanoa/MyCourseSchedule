import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Sifter from 'sifter';
import Search from 'util/search';
import { connect } from 'react-redux';
import { defaultMemoize } from 'reselect';
import _ from 'lodash';

import { getCourses } from 'reducers/courses';

import './CourseSearch.scss';

const SORT_PROP_TYPE = PropTypes.oneOfType([
  PropTypes.oneOf([false, undefined, null]),
  PropTypes.shape({
    weight: PropTypes.number.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
  }),
]).isRequired;

@connect(state => ({
  courses: getCourses(state),
}))
class CourseSearch extends PureComponent {
  static propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    allowEmpty: PropTypes.bool,
    engine: PropTypes.oneOf(['sifter', 'search']),
    sort: PropTypes.shape({
      code: SORT_PROP_TYPE,
      name: SORT_PROP_TYPE,
      credits: SORT_PROP_TYPE,
      location: SORT_PROP_TYPE,
    }),
  };

  static defaultProps = {
    placeholder: '',
    onChange: () => {},
    engine: 'search',
    allowEmpty: true,
    sort: {
      code: { weight: 0.25, direction: 'asc' },
      name: false,
      credits: false,
      location: false,
    },
  };

  constructor() {
    super();

    this.state = {
      search: '',
    };
  }

  componentDidMount() {
    this.props.onChange(
      this.searchResults(
        this.state.search,
        this.props.courses,
        this.props.sort,
        this.props.engine,
        this.props.allowEmpty
      )
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.courses !== this.props.courses ||
      prevProps.sort !== this.props.sort ||
      prevProps.onChange !== this.props.onChange ||
      prevState.search !== this.state.search ||
      prevProps.engine !== this.props.engine ||
      prevProps.allowEmpty !== this.props.allowEmpty
    ) {
      this.props.onChange(
        this.searchResults(
          this.state.search,
          this.props.courses,
          this.props.sort,
          this.props.engine,
          this.props.allowEmpty
        )
      );
    }
  }

  getSifterSort = defaultMemoize(sort =>
    _.sortBy(
      _.filter(
        _.map(
          sort,
          (opt, field) =>
            opt && {
              field,
              direction: opt.direction,
              weight: 1000 - opt.weight,
            }
        )
      ),
      'weight'
    )
  );

  getSifter = defaultMemoize(
    courses =>
      new Sifter(
        _.map(courses, course => ({
          ...course,
          title: `${course.code} ${course.name}`,
        }))
      )
  );

  getSearch = defaultMemoize(
    courses =>
      new Search(courses, [
        'code',
        'name',
        'credits',
        'location',
        'description',
      ])
  );

  getSearchSort = defaultMemoize(sort =>
    _.map(sort, (opt, field) => ({
      ...opt,
      field,
    }))
  );

  searchResults = defaultMemoize(
    (search = '', courses = [], sort, engine, allowEmpty) => {
      const results =
        engine === 'search'
          ? this.getSearch(courses).search(search, {
              fields: ['code', 'name'],
              sort: this.getSearchSort(sort),
              conjunction: 'or',
              cutoff: 0.275,
            })
          : this.getSifter(courses).search(search, {
              fields: ['code', 'name'],
              sort: this.getSifterSort(sort),
              conjunction: 'or',
              filter: true,
              nesting: false,
            });

      return allowEmpty || search.length
        ? _.map(results.items, ({ id }) => courses[id])
        : [];
    }
  );

  inputChangeHandler = e => {
    e.preventDefault();

    if (e.target.value !== this.state.search) {
      this.setState({
        search: e.target.value,
      });
    }
  };

  render() {
    const { className, placeholder } = this.props;

    return (
      <div className={cx('course-search', className)}>
        <input
          type="text"
          placeholder={placeholder}
          spellCheck={false}
          onChange={this.inputChangeHandler}
        />
      </div>
    );
  }
}

export default CourseSearch;
