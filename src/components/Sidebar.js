import React, {PureComponent} from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';

import './Sidebar.scss';

@withRouter
class SidebarButton extends PureComponent {
    static get propTypes() {
        return {
            title: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
            to: PropTypes.string,
        };
    }

    render() {
        const {
            title,
            icon,
            to
        } = this.props;

        return (
            <NavLink className='sidebar-button' to={to || ''}>
                <h3 className='title'>{title}</h3>
            </NavLink>
        );
    }
}

@withRouter
class Sidebar extends PureComponent {
    render() {
        return (
            <div id='sidebar'>
                <SidebarButton
                    title='Dashboard'
                    icon='dashboard'
                    to='/dashboard'
                />
                <SidebarButton
                    title='Schedule'
                    icon='calender'
                    to='/schedule'
                />
                <SidebarButton
                    title='Courses'
                    icon='courses'
                    to='/courses'
                />
            </div>
        );
    }
}

export default Sidebar;
