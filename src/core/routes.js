import React from 'react';
import {
    BrowserRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import Dashboard from 'views/DashboardView';
import Schedule from 'views/ScheduleView';
import Courses from 'views/CoursesView';

import App from 'components/App';

const routes = (
    <BrowserRouter>
        <App>
            <Switch>
                <Route exact path='/' component={Dashboard}/>
                <Route path='/schedule' component={Schedule}/>
                <Route path='/courses' component={Courses}/>
                <Redirect to='/'/>
            </Switch>
        </App>
    </BrowserRouter>
);

export default routes;
