import React, {PureComponent} from 'react';
import {withRouter} from 'react-router-dom';

import Topbar from 'components/layout/Topbar';
import Sidebar from 'components/layout/Sidebar';

import './App.scss';

@withRouter
class App extends PureComponent {
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
