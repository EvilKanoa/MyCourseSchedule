import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
    getError,
    isLoading,
    fetchCourses
} from 'reducers/courses';

import {
    FiLoader as LoaderIcon,
    FiDownload as DownloadIcon
} from 'react-icons/fi';

import HeaderImage from 'header.png';
import './Topbar.scss';

@connect(
    (state) => ({
        loading: isLoading(state),
        error: getError(state)
    }),
    (dispatch) => bindActionCreators({
        fetchCourses
    }, dispatch)
)
class Topbar extends PureComponent {
    render() {
        return (
            <div id='topbar'>
                <img id='header-image' src={HeaderImage}/>
                <div className='status-icon'
                     onClick={() => this.props.fetchCourses()}
                >
                    { this.props.loading ?
                        <LoaderIcon
                            className='loading'
                            size={32}
                            color='yellow'
                        /> :
                        <DownloadIcon
                            size={32}
                            color={this.props.error ? 'red' : 'green'}
                        />
                    }
                </div>
            </div>
        )
    }
}

export default Topbar;
