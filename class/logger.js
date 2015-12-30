import {createLogger} from 'bunyan';

export default class Logger
{
    constructor()
    {
        let log = createLogger(
        {
            name: 'es6-express-rest-api',
            streams: [
            {
                level: 'info',
                stream: process.stdout
            },
            {
                level: 'warn',
                path: './logs/warn.log',
                type: 'rotating-file',
                period: '1d', // daily rotation
                count: 7 // keep 7 back copies
            },
            {
                level: 'error',
                path: './logs/error.log',
                type: 'rotating-file',
                period: '1d',
                count: 7
            }]
        });

        return log;
    }
}
