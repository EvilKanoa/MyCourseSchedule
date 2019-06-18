import React, { PureComponent } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  FiCalendar as CalenderIcon,
  FiBox as DashboardIcon,
  FiBook as CoursesIcon,
} from 'react-icons/fi';

import Footer from 'components/layout/Footer';

import './Sidebar.scss';

@withRouter
class SidebarButton extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
    to: PropTypes.string,
  };

  render() {
    const Icon = this.props.icon;

    return (
      <NavLink
        className="sidebar-button sidebar-element"
        to={this.props.to || ''}
      >
        <Icon size={26} color="black" className="icon" />
        <h3>{this.props.title}</h3>
      </NavLink>
    );
  }
}

@withRouter
class Sidebar extends PureComponent {
  render() {
    return (
      <div id="sidebar">
        <SidebarButton title="Dashboard" icon={DashboardIcon} to="/dashboard" />
        <SidebarButton title="Schedule" icon={CalenderIcon} to="/schedule" />
        <SidebarButton title="Courses" icon={CoursesIcon} to="/courses" />

        <Footer />
      </div>
    );
  }
}

export default Sidebar;
