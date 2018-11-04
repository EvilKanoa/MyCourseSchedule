export const corsEscapeAddress = 'https://cors-escape.herokuapp.com/';
export const corsEscape = (url) => `${corsEscapeAddress}${url}`;

export const errorHandler = (response) =>
    response.ok ?
        Promise.resolve(response) :
        Promise.reject(Error(`${response.status}: ${response.statusText}`));

export const jsonHandler = (response) => response.json();

