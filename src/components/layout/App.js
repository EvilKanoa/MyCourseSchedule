import React, {PureComponent} from 'react';
import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as Sentry from '@sentry/browser';

import Topbar from 'components/layout/Topbar';
import Sidebar from 'components/layout/Sidebar';
import {fetchCourses} from 'reducers/courses';

import './App.scss';

@withRouter
@connect(
    null,
    (dispatch) => bindActionCreators({
        fetchCourses
    }, dispatch)
)
class App extends PureComponent {
    componentDidMount() {
        this.props.fetchCourses();
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error });
        Sentry.withScope(scope => {
            Object.keys(errorInfo).forEach(key => {
                scope.setExtra(key, errorInfo[key]);
            });
            Sentry.captureException(error);
        });
    }

    render() {
        return (
            <div id='app'>
                <Topbar/>
                <Sidebar/>

                <div id='view'>
                    { this.props.children }
                </div>
            </div>
        );
    }
}

export default App;
