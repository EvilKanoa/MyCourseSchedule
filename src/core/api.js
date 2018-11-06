import {errorHandler, jsonHandler} from 'util/fetchUtils';

class API {
    constructor(url) {
        this.urlString = url;
    }

    url = (resource = '') => `${this.urlString}${resource}`;

    getCourses = async (term) => await fetch(this.url(`courses/${term}`))
        .then(errorHandler)
        .then(jsonHandler);
}

const instance = new API(process.env.WEBADVISOR_API);

export default instance;
