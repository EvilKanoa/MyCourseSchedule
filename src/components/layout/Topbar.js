import React, {PureComponent} from 'react';

import HeaderImage from 'header.png';
import './Topbar.scss';

class Topbar extends PureComponent {
    render() {
        return (
            <div id='topbar'>
                <img id='header-image' src={HeaderImage}/>
            </div>
        )
    }
}

export default Topbar;
