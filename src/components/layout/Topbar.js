import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getError,
  isLoading,
  getTerm,
  setTerm,
  fetchCourses,
} from 'reducers/courses';

import {
  FaSpinner as LoaderIcon,
  FaDownload as DownloadIcon,
} from 'react-icons/fa';

import HeaderImage from 'header.png';
import './Topbar.scss';

@connect(
  state => ({
    loading: isLoading(state),
    error: getError(state),
    term: getTerm(state),
  }),
  dispatch =>
    bindActionCreators(
      {
        fetchCourses,
        setTerm,
      },
      dispatch
    )
)
class Topbar extends PureComponent {
  refresh = () => {
    if (!this.props.loading) {
      this.props.fetchCourses();
    }
  };

  selectTerm = e => {
    if (!this.props.loading) {
      this.props.setTerm(e.target.value);
      this.props.fetchCourses();
    }
  };

  render() {
    return (
      <div id="topbar">
        <img id="header-image" src={HeaderImage} />
        <select
          className="term-select"
          value={this.props.term}
          disabled={!!this.props.loading}
          onChange={this.selectTerm}
        >
          <option value="S19">Summer 2019</option>
          <option value="F19">Fall 2019</option>
          <option value="W20">Winter 2020</option>
          <option value="S20">Summer 2020</option>
          <option value="F20">Fall 2020</option>
          <option value="W21">Winter 2021</option>
        </select>
        <div className="status-icon" onClick={this.refresh}>
          {this.props.loading ? (
            <LoaderIcon className="loading" size={32} color="gray" />
          ) : (
            <DownloadIcon size={32} color={this.props.error ? 'red' : 'gray'} />
          )}
        </div>
      </div>
    );
  }
}

export default Topbar;
