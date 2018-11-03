import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {defaultMemoize} from 'reselect';

import './WeekCalendar.scss';

const DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

const dayTypeValidator = (props, propName, componentName) => {
    const prop = _.get(props, propName, '').toLowerCase();
    if (!_.some(DAYS, (day) =>
        day.toLowerCase() === prop || `${day}s`.toLowerCase() === prop
    )) {
        return new Error(
            `Invalid prop '${propName}' (= '${props[propName]}') ` +
            `supplied tp '${componentName}'. Expecting weekday.`
        );
    }
};

const getDayIndex = (day) => _.findIndex(DAYS, (test) =>
    day.trim().toLowerCase() === test.toLowerCase() || day.trim().toLowerCase() === `${test}s`.toLowerCase()
);

const floor = (x) => ~~x;

class WeekCalendar extends PureComponent {
    static rowHeaderRenderer = (minutes) => (
        <span>
            { _.padStart(Math.floor(minutes / 60), 2, '0') }:{ _.padStart(minutes % 60, 2, '0') }
        </span>
    );

    static eventRenderer = (event) => (
        <span>
            { event.content }
        </span>
    );

    static propTypes = {
        days: PropTypes.oneOf(_.range(1, 8)),
        interval: PropTypes.number,
        start: PropTypes.number,
        end: PropTypes.number,
        weekStart: dayTypeValidator,
        rowHeaderRenderer: PropTypes.func,
        eventRenderer: PropTypes.func,
        events: PropTypes.arrayOf(PropTypes.shape({
            days: PropTypes.arrayOf(dayTypeValidator).isRequired,
            start: PropTypes.number.isRequired,
            end: PropTypes.number.isRequired,
        })),
        precision: PropTypes.number,
    };

    static defaultProps = {
        days: 5,
        interval: 30,
        weekStart: 'monday',
        start: 0,
        end: 24 * 60,
        rowHeaderRenderer: WeekCalendar.rowHeaderRenderer,
        eventRenderer: WeekCalendar.eventRenderer,
        events: [{
            days: ['monday', 'TUESDAYS'],
            start: 30,
            end: 60,
            content: 'first'
        },{
            days: ['monday', 'wednesdays', 'friday'],
            start: 135,
            end: 200,
            content: 'second'
        },{
            days: ['SUNday', 'SAturdays', 'thursday'],
            start: 200,
            end: 255,
            content: 'third'
        }],
        precision: 5,
    };

    gridify = (x) => floor(x / this.props.precision)

    getHeaders = defaultMemoize((days, weekStart) => {
        const startIndex = getDayIndex(weekStart);
        return _.map(_.range(days), (day) => (
            <div
                className='header'
                key={day}
                style={{
                    gridColumnStart: day + 2,
                    gridColumnEnd: day + 3,
                    gridRowStart: 1,
                    gridRowEnd: 2
                }}
            >
                { DAYS[(startIndex + day) % 7] }
            </div>
        ));
    });

    getRowHeaders = defaultMemoize((start, end, interval, renderer) =>
        _.map(_.range(start, end + 1, interval), (minutes) => (
            <div
                className='row-header'
                key={minutes}
                style={{
                    gridColumnStart: 1,
                    gridColumnEnd: 1,
                    gridRowStart: this.gridify(minutes - start + 2),
                    gridRowEnd: this.gridify(minutes - start + interval + 2)
                }}
            >
                { renderer(minutes, start, end, interval) }
            </div>
        ))
    );

    getEventElements = defaultMemoize((events, renderer, weekStart, numDays) => {
        const startIdx = getDayIndex(weekStart);

        return _.flatMap(events, (event, index) =>
            _.map(event.days, (day) => {
                const dayPos = (7 + (getDayIndex(day) - startIdx)) % 7;

                return dayPos < numDays && (
                    <div
                        className='event-container'
                        key={`${index}-${day}`}
                        style={{
                            gridColumnStart: dayPos + 2,
                            gridColumnEnd: dayPos + 3,
                            gridRowStart: this.gridify(event.start + 2),
                            gridRowEnd: this.gridify(event.end + 2)
                        }}
                    >
                        {renderer(event, day)}
                    </div>
                );
            })
        );
    });

    render() {
        const {
            days,
            interval,
            start,
            end,
            weekStart,
            rowHeaderRenderer,
            eventRenderer,
            events,
        } = this.props;

        return (
            <div className='week-calendar'>
                { this.getHeaders(days, weekStart) }
                { this.getRowHeaders(start, end, interval, rowHeaderRenderer) }
                { this.getEventElements(events, eventRenderer, weekStart, days) }
            </div>
        );
    }
}

export default WeekCalendar;
