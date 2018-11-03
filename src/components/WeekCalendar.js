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

class WeekCalendar extends PureComponent {
    static rowHeaderFormatter = (minutes) => (
        <span>
            { _.padStart(Math.floor(minutes / 60), 2, '0') }:{ _.padStart(minutes % 60, 2, '0') }
        </span>
    );

    static propTypes = {
        days: PropTypes.oneOf(_.range(1, 8)),
        interval: PropTypes.number,
        start: PropTypes.number,
        end: PropTypes.number,
        weekStart: dayTypeValidator,
        rowHeaderFormatter: PropTypes.func,
        events: PropTypes.arrayOf(PropTypes.shape({
            days: PropTypes.arrayOf(dayTypeValidator).isRequired,
            start: PropTypes.number.isRequired,
            end: PropTypes.number.isRequired,
        })),
    };

    static defaultProps = {
        days: 5,
        interval: 30,
        weekStart: 'monday',
        start: 0,
        end: 24 * 60,
        rowHeaderFormatter: WeekCalendar.rowHeaderFormatter,
        events: [{
            days: ['monday', 'TUESDAYS'],
            start: 30,
            end: 60,
            id: 'first'
        },{
            days: ['monday', 'wednesdays', 'friday'],
            start: 120,
            end: 140,
            id: 'second'
        },{
            days: ['SUNday', 'SAturdays', 'thursday'],
            start: 200,
            end: 255,
            id: 'third'
        }],
    };

    getHeader = defaultMemoize((days, weekStart) => {
        const startIndex = getDayIndex(weekStart);
        return (
            <thead>
            <tr>
                <th></th>
                {_.map(_.range(days), (day) => (
                    <th key={day}>{DAYS[(startIndex + day) % 7]}</th>
                ))}
            </tr>
            </thead>
        );
    });

    getRowHeaders = defaultMemoize((start, end, interval, formatter) =>
        _.map(_.range(start, end + 1, interval), (minutes) => formatter(minutes, start, end, interval))
    );

    getIndexedEvents = defaultMemoize((events, numDays, weekStart) =>
        _.map(_.range(numDays), (dayIndex) =>
            _.filter(events, ({ days }) => _.some(days, (day) =>
                getDayIndex(day) === ((dayIndex + getDayIndex(weekStart)) % 7)
            ))
        )
    );

    getEventIndexMap = defaultMemoize((events) => _.reduce(
        events,
        (map, event, index) => map.set(event, index),
        new Map()
    ));

    getEventGrid = defaultMemoize((start, end, days, indexedEvents, eventIndexMap) => {
        const grid = new Array(days);
        for (let day = 0; day < days; day++) {
            const list = grid[day] = new Array(end - start + 1).fill(undefined);
            _.forEach(indexedEvents[day] || [], (event) => {
                for (let step = event.start; step <= event.end; step++) {
                    list[step] = eventIndexMap.get(event);
                }
            });
        }
        return grid;
    });

    render() {
        const {
            days,
            interval,
            start,
            end,
            weekStart,
            rowHeaderFormatter,
            events,
        } = this.props;

        const indexedEvents = this.getIndexedEvents(events, days, weekStart);
        const eventMap = this.getEventIndexMap(events);
        const rowHeaders = this.getRowHeaders(start, end, interval, rowHeaderFormatter);
        const eventGrid = this.getEventGrid(start, end, days, indexedEvents, eventMap);

        return (
            <div className='week-calendar'>
                <table>
                    { this.getHeader(days, weekStart) }
                    <tbody>
                        { _.map(_.range(start, end + 1), (step) => {

                            return (
                                <tr key={step}>
                                    { step % interval === 0 &&
                                        <th
                                            key={`row-header-${step / interval}`}
                                            rowSpan={interval}
                                        >
                                            { rowHeaders[step / interval] }
                                        </th>
                                    }
                                    { _.compact(_.map(_.range(days),
                                        (day) => {
                                        const key = (day + 1) * (step + 1);
                                            if (eventGrid[day][step] === undefined) {
                                                return <td key={key}></td>;
                                            } else {
                                                const event = events[eventGrid[day][step]];
                                                return event.start === step ?
                                                    <td
                                                        rowSpan={event.end - event.start + 1}
                                                        key={key}
                                                        className='event'
                                                    >
                                                        {event.id}
                                                    </td> :
                                                    null;
                                            }
                                        }
                                    )) }
                                </tr>
                            );
                        }) }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default WeekCalendar;
