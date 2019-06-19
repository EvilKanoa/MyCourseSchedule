import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'graphql-hooks';

import Course from 'components/Course';

const COURSE_QUERY = `
query CourseQuery($code: String!, $term: Term!, $institution: School!) {
  course(code: $code, term: $term, institution: $institution) {
    code
    name
    description
    term
    credits
    institution
    location
    level
    sections {
      id
      faculty
      available
      capacity
      meetings {
        type
        name
        day
        start
        end
        available
        capacity
        location
      }
    }
  }
}`;

const CourseContainer = ({ code, term, institution, ...props }) => {
  const { data, error, loading } = useQuery(COURSE_QUERY, {
    variables: { code, term, institution },
  });

  if (error) {
    return <span>Error: {error}</span>;
  } else if (loading) {
    return <span>Loading...</span>;
  } else if (data && data.course && data.course.code) {
    return <Course data={data.course} {...props} />;
  } else {
    return <span>Unknown error</span>;
  }
};

CourseContainer.propTypes = {
  code: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired,
  institution: PropTypes.string.isRequired,
};

export default CourseContainer;
