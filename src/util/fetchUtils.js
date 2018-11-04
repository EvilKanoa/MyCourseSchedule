export const errorHandler = (response) => {
    if (!response.ok) {
        throw Error(`${response.status}: ${response.statusText}`);
    }
    return response;
};

export const jsonHandler = (response) => response.json();

