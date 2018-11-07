import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
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
        <p className='center-content'>
            { _.padStart(floor(minutes / 60) - (minutes / 60 < 13 ? 0 : 12), 2, '0') }
            :{ _.padStart(minutes % 60, 2, '0') }
            { minutes / 60 < 12 ? 'am' : 'pm' }
        </p>
    );

    static eventRenderer = (event) => (
        <div className='default-calendar-event'>
            { event.content }
        </div>
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
            content: PropTypes.any
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
        events: [],
        precision: 5,
    };

    gridify = (y, precision = this.props.precision) => floor(y / precision);

    getHeaders = defaultMemoize((days, weekStart, start, end, interval, precision) => {
        const startIndex = getDayIndex(weekStart);
        return _.map(_.range(days), (day) => [
            (
                <div
                    className={cx('header', {
                        first: day === 0,
                        last: day === (days - 1)
                    })}
                    key={day}
                    style={{
                        gridColumnStart: day + 2,
                        gridColumnEnd: day + 3,
                        gridRowStart: 1,
                        gridRowEnd: 2
                    }}
                >
                    <p className='center-content'>
                        { DAYS[(startIndex + day) % 7] }
                    </p>
                </div>
            ), (
                <div
                    className={cx('grid-line-y', {
                        first: day === 0,
                        last: day === (days - 1)
                    })}
                    key={`${day}-grid-line-y`}
                    style={{
                        gridColumnStart: day + 2,
                        gridColumnEnd: day + 3,
                        gridRowStart: 2,
                        gridRowEnd: this.gridify(end - start + interval, precision) + 2
                    }}
                ></div>
            )
        ]);
    });

    getRowHeaders = defaultMemoize((start, end, interval, numDays, renderer, precision) =>
        _.map(_.range(start, end + 1, interval), (minutes) => [
            (
                <div
                    className={cx('row-header', {
                        first: minutes === start,
                        last: minutes === end
                    })}
                    key={minutes}
                    style={{
                        gridColumnStart: 1,
                        gridColumnEnd: 2,
                        gridRowStart: this.gridify(minutes - start, precision) + 2,
                        gridRowEnd: this.gridify(minutes - start + interval, precision) + 2
                    }}
                >
                    { renderer(minutes, start, end, interval) }
                </div>
            ), (
                <div
                    className={cx('grid-line-x', {
                        first: minutes === start,
                        last: minutes === end
                    })}
                    key={`${minutes}-grid-line-x`}
                    style={{
                        gridColumnStart: 2,
                        gridColumnEnd: numDays + 2,
                        gridRowStart: this.gridify(minutes - start, precision) + 2,
                        gridRowEnd: this.gridify(minutes - start + interval, precision) + 2
                    }}
                ></div>
            )
        ])
    );

    getEventElements = defaultMemoize((start, events, renderer, weekStart, numDays, precision) => {
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
                            gridRowStart: this.gridify(event.start - start, precision),
                            gridRowEnd: this.gridify(event.end - start, precision) + 2
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
            className,
            precision,
            ...rest
        } = this.props;

        return (
            <div {...rest} className={cx('week-calendar', className)}>
                <div
                    className='header-row'
                    style={{
                        gridColumnStart: 1,
                        gridColumnEnd: days + 2,
                        gridRowStart: 1,
                        gridRowEnd: 2
                    }}
                ></div>
                { this.getHeaders(days, weekStart, start, end, interval, precision) }
                <div
                    className='row-header-row'
                    style={{
                        gridColumnStart: 1,
                        gridColumnEnd: 2,
                        gridRowStart: 1,
                        gridRowEnd: this.gridify(end - start + interval) + 2
                    }}
                ></div>
                { this.getRowHeaders(start, end, interval, days, rowHeaderRenderer, precision) }
                { this.getEventElements(start, events, eventRenderer, weekStart, days, precision) }
            </div>
        );
    }
}

export default WeekCalendar;
