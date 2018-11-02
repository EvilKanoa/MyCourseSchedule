import React, {PureComponent} from 'react';

import HeaderImage from 'header.png';

class Topbar extends PureComponent {
    render() {
        return (
            <div id='topbar'>
                <img src={HeaderImage}/>
            </div>
        )
    }
}

export default Topbar;
