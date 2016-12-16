import "babel-polyfill";
import fs from 'fs';
import { isArray } from 'util';
import Result from '../class/result';
import async from 'async';
import path from 'path';

let result = new Result().getResult();
let apiPath = path.resolve(__dirname, "../api");

export default async function(app)
{
    try
    {
        await routesSet(app);
        await routeErrorSet(app);
    }
    catch (e)
    {
        console.log(e);
    }
    finally
    {
        return new Promise((resolve, reject) => {
            resolve(null);
        });
    }
}

function routesSet(app)
{
    return new Promise((resolve, reject) =>
    {
        fs.readdir(apiPath, (err, files) =>
        {
            for (let fileName of files)
            {
                if (fileName !== '.DS_Store')
                {
                    let apiObj = require('../api/' + fileName).default;
                    let { routes, initExec } = apiObj.init();
                    if ((initExec !== undefined && !initExec) && (isArray(routes) && routes.length > 0))
                    {
                        for (let route of routes)
                        {
                            let url = route.url.toLowerCase();
                            let method = route.method.toLowerCase();
                            app[route.method.toLowerCase()](url, apiObj.exec);
                        }
                    }
                    else if (initExec !== undefined && initExec)
                    {
                        apiObj.exec();
                    }
                }
            }
            resolve();
        });
    });
}

function routeErrorSet(app)
{
    return new Promise((resolve, reject) =>
    {
        app.get('*', (req, res) => {
            res.status(404).send({
                "result": 0,
                "errorcode": "404",
                "message": "route not found",
                "data": {}
            });
        });

        app.use((err, req, res, next) =>{
            log.error(err);
            res.status(500).send({
                "result": 0,
                "errorcode": "500",
                "message": "server error",
                "data": {}
            });
        });

        resolve();
    });
}
