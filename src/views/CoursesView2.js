import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useQuery } from 'graphql-hooks';
import InfiniteScroll from 'react-infinite-scroller';

import { getTerm, getInstitution } from 'reducers/courses';

import Card from 'components/Card';
import CourseContainer from 'components/CourseContainer';

import './CoursesView2.scss';

const SEARCH_QUERY = `
query SearchQuery(
  $search: String!
  $term: Term!
  $institution: School!
  $skip: Int!
  $limit: Int!
) {
  search(
    query: $search
    term: $term
    institution: $institution
    skip: $skip
    limit: $limit
  ) {
    results {
      code
    }
  }
}`;

const CoursesView = ({ term, institution }) => {
  const [search, setSearch] = useState('');
  const { data, error, loading } = useQuery(SEARCH_QUERY, {
    variables: { search, term, institution, skip: 0, limit: 100 },
  });

  return (
    <div id="view-courses">
      <div className="course-search">
        <input
          type="text"
          value={search}
          placeholder="Search courses..."
          onChange={e => setSearch(e.target.value)}
          spellCheck={false}
        />
      </div>

      {!loading && !error && data && data.results
        ? data.results.map(
            ({ code }) =>
              code && (
                <Card className="course-card" key={course.code}>
                  <CourseContainer
                    code={code}
                    term={term}
                    institution={institution}
                  />
                </Card>
              ),
          )
        : 'Loading...'}
    </div>
  );
};

export default connect(state => ({
  term: getTerm(state),
  institution: getInstitution(state),
}))(CoursesView);
