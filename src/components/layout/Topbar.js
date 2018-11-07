import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
    getError,
    isLoading,
    fetchCourses
} from 'reducers/courses';

import {
    FaSpinner as LoaderIcon,
    FaDownload as DownloadIcon
} from 'react-icons/fa';

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
    refresh = () => {
        if (!this.props.loading) {
            this.props.fetchCourses();
        }
    };

    render() {
        return (
            <div id='topbar'>
                <img id='header-image' src={HeaderImage}/>
                <div className='status-icon'
                     onClick={this.refresh}
                >
                    { this.props.loading ?
                        <LoaderIcon
                            className='loading'
                            size={32}
                            color='gray'
                        /> :
                        <DownloadIcon
                            size={32}
                            color={this.props.error ? 'red' : 'gray'}
                        />
                    }
                </div>
            </div>
        )
    }
}

export default Topbar;
