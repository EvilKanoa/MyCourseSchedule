import React, {PureComponent} from 'react';
import {withRouter} from 'react-router-dom';

import Topbar from 'components/Topbar';
import Sidebar from 'components/Sidebar';

@withRouter
class App extends PureComponent {
    render() {
        return (
            <div id='app'>
                <Topbar/>
                <Sidebar/>
                { this.props.children }
            </div>
        );
    }
}

export default App;
