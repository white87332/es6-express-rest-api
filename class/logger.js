import { createLogger } from 'bunyan';

export default class Logger
{
    constructor()
    {
        this.log = createLogger(
        {
            name: 'es6-express-rest-api',
            streams: [
            {
                level: 'info',
                stream: process.stdout
            },
            {
                level: 'error',
                path: './logs/error.log',
                type: 'rotating-file',
                period: '1d',
                count: 7
            }]
        });
    }

    getLog()
    {
        return this.log;
    }
}
