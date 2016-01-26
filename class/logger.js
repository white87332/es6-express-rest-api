import { createLogger } from 'bunyan';
import { existsSync, mkdirSync } from 'fs';

export default class Logger
{
    constructor()
    {
        this.d = new Date();
        this.year = this.d.getFullYear();
        this.month = this.d.getMonth() + 1;
        this.day = this.d.getDate();
        this.setFolder();

        this.log = createLogger(
        {
            name: 'es6-express-rest-api',
            streams: [
            {
                level: 'info',
                path: './logs/' + this.getPath() + 'info.log'
            },
            {
                level: 'error',
                path: './logs/' + this.getPath() + 'error.log'
            }]
        });
    }

    getPath()
    {
        let date = this.year + "/" + this.month + "/" + this.day + "/";
        return date;
    }

    setFolder()
    {
        this.month = (this.month === 1) ? "0" + this.month : this.month;

        if (!existsSync('./logs/' + this.year))
        {
            mkdirSync('./logs/' + this.year);
        }

        if (!existsSync('./logs/' + this.year + "/" + this.month))
        {
            mkdirSync('./logs/' + this.year + "/" + this.month);
        }

        if (!existsSync('./logs/' + this.year + "/" + this.month + "/" + this.day))
        {
            mkdirSync('./logs/' + this.year + "/" + this.month + "/" + this.day);
        }
    }

    getLog()
    {
        return this.log;
    }
}
