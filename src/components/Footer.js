import React, {PureComponent} from 'react';

class Footer extends PureComponent {
    render() {
        return (
            <div className='footer sidebar-element'>
                <pre>
                    Copyright &copy; {new Date().getFullYear()}
                    <br />
                    Kanoa Haley
                </pre>
            </div>
        );
    }
}

export default Footer;
