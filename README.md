# My Course Schedule
### Quick and easy course schedule development for any institution!

Demo: [mycourseschedule.com](http://www.mycourseschedule.com/) or [my-course-schedule.herokuapp.com](https://my-course-schedule.herokuapp.com/)

## Development
This project relies on NodeJS 10 and yarn.

The development server can be started using `yarn dev` and will be accessible at `localhost:3000`.

## Production
This project is intended to be built and distributed as a set of files to be served by any static web server.

To create a production ready build, run `yarn build` and the `dist` folder will be ready to be placed on a server!

You can also run the server directly using `spa-http-server` by running `yarn prod` which will run a production ready build on an HTTP server on port 80.
To specify a different port, use the `PORT` environment variable. E.g., `PORT=8080 yarn prod`.

## Deploying
This repository represents the source of the live application on [mycourseschedule.com](http://www.mycourseschedule.com/). This demo is built and deployed automatically from the `master` branch of this repo.

If you are contributing to this project, please do not leave build files within a PR since they will be rebuilt when deployed anyways.
