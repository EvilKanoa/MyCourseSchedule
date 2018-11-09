import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import {defaultMemoize} from 'reselect';

import './MiniSchedule.scss';

const gridLines = [
    ..._.map(_.range(1, 5), (i) => (
        <div
            className='mini-schedule-grid-line-y'
            key={`mini-schedule-grid-line-y-${i}`}
            style={{
                gridColumnStart: i,
                gridColumnEnd: i + 1,
                gridRowStart: 1,
                gridRowEnd: 29
            }}
        ></div>
    )),
    ..._.map(_.range(1, 28), (i) => (
        <div
            className='mini-schedule-grid-line-x'
            key={`mini-schedule-grid-line-x-${i}`}
            style={{
                gridColumnStart: 1,
                gridColumnEnd: 6,
                gridRowStart: i,
                gridRowEnd: i + 1
            }}
        ></div>
    ))
];

const columnByDays = {
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
};

const rowFromStartTime = (time) =>
    Math.floor(((parseInt(time.split(':')[0], 10) * 60) + parseInt(time.split(':')[1], 10) - (8 * 60)) / 30) + 1;

const rowFromEndTime = (time) =>
    Math.ceil(((parseInt(time.split(':')[0], 10) * 60) + parseInt(time.split(':')[1], 10) - (8 * 60)) / 30) + 1;

class MiniSchedule extends PureComponent {
    static propTypes = {
        schedule: PropTypes.object.isRequired,
        selected: PropTypes.bool,
        onClick: PropTypes.func
    };

    static defaultProps = {
        selected: false,
        onClick: () => {}
    };

    getBlocks = defaultMemoize((meetings) => _.map(meetings, ({ start, end, day }, idx) => (
        <div
            className='mini-schedule-block'
            key={`mini-schedule-block-${idx}`}
            style={{
                gridColumnStart: columnByDays[day],
                gridColumnEnd: columnByDays[day] + 1,
                gridRowStart: rowFromStartTime(start),
                gridRowEnd: rowFromEndTime(end),

                marginRight: columnByDays[day] === 5 ? '0' : '1px',
                marginBottom: rowFromEndTime(end) === 29 ? '0' : '1px'
            }}
        ></div>
    )));

    render() {
        const { schedule, selected, onClick } = this.props;

        return (
            <div
                className={cx('mini-schedule', { selected })}
                onClick={() => onClick(schedule)}
            >
                { gridLines }
                { this.getBlocks(schedule.meetings) }
            </div>
        );
    }
}

export default MiniSchedule;
