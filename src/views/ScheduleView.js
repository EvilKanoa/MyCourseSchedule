import React, {PureComponent} from 'react';

import WeekCalendar from 'components/WeekCalendar';

class ScheduleView extends PureComponent {
    render() {
        return (
            <div id='view-schedule'>
                Schedule View
                <WeekCalendar/>
            </div>
        )
    }
}

export default ScheduleView;
