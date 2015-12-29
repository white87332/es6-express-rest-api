import {createLogger} from 'bunyan';

export default class Logger
{
    constructor()
    {
        let log = createLogger({
            name: 'es6-express-rest-api',
            streams: [
            {
                level: 'info',
                stream: process.stdout // log INFO and above to stdout
            },
            // {
            //     level: 'warn',
            //     path: './logs/warn.log' // log WARN and above to a file
            // },
            // {
            //     level: 'error',
            //     path: './logs/error.log' // log ERROR and above to a file
            // }
            ]
        });

        return log;
    }
}
