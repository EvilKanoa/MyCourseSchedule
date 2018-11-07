import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import {
    FiMaximize2 as ExpandIcon,
    FiMinimize2 as CollapseIcon
} from 'react-icons/fi';
import Card from 'components/Card';
import WeekCalendar from 'components/WeekCalendar';

import './Course.scss';

const ORDERED_MEETING_TYPES = [
    'LEC',
    'LAB',
    'SEM',
    'EXAM'
];
const ORDERED_MEETING_LABELS = [
    'Lecture',
    'Lab',
    'Seminar',
    'Examination'
];
const ORDERED_DAYS = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
];
const ORDERED_DAY_LABELS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

class Course extends PureComponent {
    static propTypes = {
        calendar: PropTypes.bool,
        data: PropTypes.shape({
            code: PropTypes.string.isRequired,
            name: PropTypes.string,
            description: PropTypes.string,
            credits: PropTypes.string,
            location: PropTypes.string,
            level: PropTypes.string,
            term: PropTypes.string,
            sections: PropTypes.arrayOf(PropTypes.shape({
                sectionId: PropTypes.string.isRequired,
                faculty: PropTypes.string,
                available: PropTypes.number,
                capacity: PropTypes.number,
                status: PropTypes.string,
                meetings: PropTypes.arrayOf(PropTypes.shape({
                    type: PropTypes.string.isRequired,
                    day: PropTypes.string,
                    start: PropTypes.string,
                    end: PropTypes.string,
                    location: PropTypes.string,
                })),
            })),
        }).isRequired,
    };

    static defaultProps = {
        calendar: false,
    };

    constructor() {
        super();

        this.state = {
            openedSections: [],
        };
    }

    toggleSection = ({ sectionId }) => {
        if (_.some(this.props.data.sections, { sectionId })) {
            this.setState({
                openedSections: this.state.openedSections.includes(sectionId) ?
                    _.without(this.state.openedSections, sectionId) :
                    [ ...this.state.openedSections, sectionId ]
            });
        }
    };

    computeEvents = (section) => _.map(
        _.filter(section.meetings, ({ type }) => type !== 'EXAM'),
        ({ type, day, start, end, location }) => ({
            days: [day],
            start: parseInt(start.split(':')[0] * 60, 10) + parseInt(start.split(':')[1], 10),
            end: parseInt(end.split(':')[0] * 60, 10) + parseInt(end.split(':')[1], 10),
            content: ORDERED_MEETING_TYPES.includes(type) ?
                ORDERED_MEETING_LABELS[ORDERED_MEETING_TYPES.indexOf(type)] :
                type
        })
    );

    getSectionTypes = (section) => {
        const counts = _.countBy(section.meetings, 'type');

        return (
            <span className='section-types'>
                { _.join(
                    _.map(
                        _.filter(ORDERED_MEETING_TYPES, (t) => counts[t]),
                        (type) => `${counts[type]} ${type}`
                    ),
                    ', '
                ) }
            </span>
        );
    };

    getMeetingElements = (section) => {
        const sorted = _.sortBy(section.meetings, ({ type, day, start, end }) =>
            `${_.indexOf(ORDERED_DAYS, day)}${start}${end}${_.indexOf(ORDERED_MEETING_TYPES, type)}`
        );

        return _.map(sorted, ({ type, day, start, end, location }, idx) => (
            <Card
                className={cx('section-meeting', 'section-meeting-' + type)}
                key={this.props.data.code + section.sectionId + idx}
            >
                <span className='meeting-type'>
                    {
                        ORDERED_MEETING_TYPES.includes(type) ?
                            ORDERED_MEETING_LABELS[ORDERED_MEETING_TYPES.indexOf(type)] :
                            type
                    }
                </span>
                <span className='meeting-day'>
                    {
                        ORDERED_DAYS.includes(day) ?
                            ORDERED_DAY_LABELS[ORDERED_DAYS.indexOf(day)] :
                            day
                    }
                </span>
                <span className='meeting-time'>{ `${start} - ${end}` }</span>
                <span className='meeting-location'>{ location }</span>
            </Card>
        ));
    };


    render() {
        const { data, calendar } = this.props;
        const isOpened = (section) => this.state.openedSections.includes(section.sectionId);

        return (
            <div className='course-widget'>
                <span className='title'>
                    { `${data.code} ${data.name || ''} (${data.term || ''}) [${data.credits || ''}]` }
                </span>
                <div className='details'>
                    <span className='details-campus'>
                        Campus: { data.location || '' }
                    </span>
                    <span className='details-level'>
                        Academic Level: { data .level || '' }
                    </span>
                </div>
                <div className='description'>
                    { data.description || `No description provided for ${data.code}.` }
                </div>

                <div className='sections-header'>Sections</div>
                <div className='sections'>
                    { _.map(data.sections, (section) =>  (
                        <div
                            className={cx(
                                'course-section',
                                {
                                    expanded: isOpened(section),
                                    closed: section.status === 'Closed'
                                }
                            )}
                            key={`${data.code}*${section.sectionId}`}
                        >
                            <div
                                className='section-header'
                                onClick={() => this.toggleSection(section)}
                            >
                                <span className='section-title'>Section { section.sectionId }</span>
                                <span className='section-faculty'>{ section.faculty || '' }</span>
                                <span className='section-status'>
                                    <p>{ section.status || '' } - { `${section.available || 0}/${section.capacity || 0}` }</p>
                                </span>
                                { this.getSectionTypes(section) }
                                { isOpened(section) ?
                                    <CollapseIcon
                                        size={16}
                                        className='icon'
                                    /> :
                                    <ExpandIcon
                                        size={15}
                                        className='icon'
                                    />
                                }
                            </div>
                            { isOpened(section) &&
                                <div className='section-body'>
                                    { this.getMeetingElements(section) }
                                    { calendar &&
                                        <WeekCalendar
                                            className='section-calendar'
                                            days={5}
                                            interval={60}
                                            start={8 * 60}
                                            end={22 * 60}
                                            weekStart={'monday'}
                                            events={this.computeEvents(section)}
                                        />
                                    }
                                </div>
                            }
                        </div>
                    )) }
                </div>
            </div>
        );
    }
}

export default Course;