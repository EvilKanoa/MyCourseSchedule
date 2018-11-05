import _ from 'lodash';

export const corsEscape = (url) => `${process.env.CORS_PROXY}${url}`;

export const errorHandler = (response) =>
    response.ok ?
        Promise.resolve(response) :
        Promise.reject(Error(`${response.status}: ${response.statusText}`));

export const jsonHandler = (response) => response.json();

export const urlencode = (data = {}) => _.join(
    _.map(_.keys(data), (key) =>
        `${_.escape(key)}=${_.escape(data[key])}`
    ), '&'
);

export const getCookie = (cookies, key) => (
    _.find(
        cookies.split(';'),
        (cookie) => cookie.trim().split('=', 2)[0].toLowerCase() === key.trim().toLowerCase()
    ).trim().split('=', 2)[1]
);
