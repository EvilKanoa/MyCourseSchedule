import React, {PureComponent} from 'react';

import WeekCalendar from 'components/WeekCalendar';
import Card from 'components/Card';

import './ScheduleView.scss';

class ScheduleView extends PureComponent {
    render() {
        return (
            <div id='view-schedule'>
                <WeekCalendar
                    className='schedule'
                    days={5}
                    start={8 * 60}
                    end={21.5 * 60}
                    interval={30}
                    weekStart={'monday'}
                />
                <Card className='courses'>
                    <p> This is a test card and it is being tested...</p>
                </Card>
            </div>
        )
    }
}

export default ScheduleView;
