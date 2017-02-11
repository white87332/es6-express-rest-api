import 'babel-polyfill';
import path from 'path';
import fs from 'fs';
import { isArray } from 'util';

let apiPath = path.resolve(__dirname, '../api');

function routesSet(app)
{
    return new Promise((resolve) =>
    {
        fs.readdir(apiPath, (err, files) =>
        {
            if (files.length > 0)
            {
                for (let fileName of files)
                {
                    if (fileName !== '.DS_Store')
                    {
                        let apiObj = require(`../api/${fileName}`).default;
                        let { routes, initExec } = apiObj.init();
                        if ((initExec !== undefined && !initExec) && (isArray(routes) && routes.length > 0))
                        {
                            for (let route of routes)
                            {
                                let url = route.url.toLowerCase();
                                app[route.method.toLowerCase()](url, apiObj.exec);
                            }
                        }
                        else if (initExec !== undefined && initExec)
                        {
                            apiObj.exec();
                        }
                    }
                }
            }
            resolve();
        });
    });
}

function routeErrorSet(app)
{
    return new Promise((resolve) =>
    {
        app.get('*', (req, res) =>
        {
            res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
        });

        app.use((err, req, res) =>
        {
            log.error(err);
            res.status(500).send({
                result: 0,
                errorcode: '500',
                message: 'server error',
                data: {}
            });
        });

        resolve();
    });
}

export default async (app) =>
{
    try
    {
        await routesSet(app);
        await routeErrorSet(app);
    }
    catch (e)
    {
        log.error(e);
    }
};
