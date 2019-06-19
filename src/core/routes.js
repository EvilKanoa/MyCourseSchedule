import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Dashboard from 'views/DashboardView';
import Schedule from 'views/ScheduleView';
import Courses from 'views/CoursesView';
import Courses2 from 'views/CoursesView2';

import App from 'components/layout/App';

const routes = (
  <BrowserRouter>
    <App>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/courses" component={Courses} />
        <Route path="/search" component={Courses2} />
        <Redirect to="/schedule" />
      </Switch>
    </App>
  </BrowserRouter>
);

export default routes;
