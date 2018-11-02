import React, { PureComponent } from 'react';
import {withRouter} from 'react-router-dom';
import Sidebar from 'components/Sidebar';

@withRouter
class App extends PureComponent {
    render() {
        return (
            <div id='app'>
                <Sidebar/>
                { this.props.children }
            </div>
        );
    }
}

export default App;
