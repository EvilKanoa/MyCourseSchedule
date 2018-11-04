export const domParser = new DOMParser();

export const parseCourses = (html) => {
    const doc = domParser.parseFromString(html, 'text/html');
    // do something with it
    return [];
};
