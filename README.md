# My Course Schedule
### Quick and easy course schedule development for any institution!

## Development
This project relies on NodeJS 8+ and npm 4+.

The development server can be started using `npm run dev` and will be accessible at `localhost:3000`.

## Production
This project is intended to be built and distributed as a set of files to be served by any static web server.

To create a production ready build, run `npm run build` and the `dist` folder will be ready to be placed on a server!

You can also run the server directly using `spa-http-server` by running `npm run prod` which will run a production ready build on an HTTP server on port 80.
To specify a different port, use the `PORT` environment variable. E.g., `PORT=8080 npm run prod`.
