class Storage {
    constructor(prefix) {
        this.prefix = prefix;
        this.engine = localStorage;
    }

    // generic methods

    makeKey = (key) => `${this.prefix}${key}`;

    serialize = (data) => JSON.stringify(data);

    deserialize = (data) => JSON.parse(data);

    set = (key, value) => {
        if (!key) return false;

        try {
            this.engine.setItem(this.makeKey(key), this.serialize(value));
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    get = (key) => {
        if (!key) return undefined;
        try {
            return this.deserialize(this.engine.getItem(this.makeKey(key)));
        } catch(err) {
            console.error(err);
            return undefined;
        }
    };

    // data specific methods

    updateCourses = (courses = []) => this.set('COURSES', courses);

    getCourses = () => this.get('COURSES') || [];

    updateSchedule = (scheduleState = {}) => this.set('SCHEDULE', scheduleState);

    getScheduleState = () => this.get('SCHEDULE') || {};
}

const instance = new Storage('MyCourseSchedule_v1_');

export default instance;
