import { createLogger } from 'bunyan';
import { existsSync, mkdirSync } from 'fs';

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
                path: './logs/' + this.setDate() + 'error.log',
            }]
        });
    }

    setDate()
    {
        this.setFolder();

        let d = new Date();
        let date = d.getFullYear() + "/" + d.getMonth() + 1 + "/" + d.getDate() + "/";
        return date;
    }

    setFolder()
    {
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let day = d.getDate();

        month = (month === 1) ? "0" + month : month;

        if (!existsSync('./logs/' + year))
        {
            mkdirSync('./logs/' + year);
        }

        if (!existsSync('./logs/' + year + "/" + month))
        {
            mkdirSync('./logs/' + year + "/" + month);
        }

        if (!existsSync('./logs/' + year + "/" + month + "/" + day))
        {
            mkdirSync('./logs/' + year + "/" + month + "/" + day);
        }
    }

    getLog()
    {
        return this.log;
    }
}
