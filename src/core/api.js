import { errorHandler, jsonHandler, wapiHandler } from 'util/fetchUtils';

class API {
  constructor(url) {
    this.urlString = url;
  }

  url = (resource = '') => `${this.urlString}${resource}`;

  getCourses = async term =>
    await fetch(this.url(`courses/${term}`))
      .then(errorHandler)
      .then(jsonHandler)
      .then(wapiHandler);
}

const instance = new API(process.env.WEBADVISOR_API);

export default instance;
