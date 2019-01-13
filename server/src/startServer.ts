import { startServer } from './server';

// start the server by running `npm run server:start`
// Pass the current directory as appPath of electron to the server, so that paths for TypeORM can be set on server side.
(async () => {
    await startServer('.');
})();
