import fs from 'fs';
import util from 'util';
import Result from '../class/result';
import {exec} from 'child_process';

export default function(app)
{
    fs.readdir('./api', (err, files) =>
    {
        for (let fileName of files)
        {
            let apiFunObj = require('../api/' + fileName)();
            let {routes, initExec} = apiFunObj.init();
            if((initExec !== undefined && !initExec) && (util.isArray(routes) && routes.length > 0))
            {
                for (let route of routes)
                {
                    let url = route.url.toLowerCase();
                    switch (route.method.toLowerCase())
                    {
                        case 'get':
                            app.get(url, apiFunObj.exec);
                            break;
                        case 'post':
                            app.post(url, apiFunObj.exec);
                            break;
                        case 'put':
                            app.put(url, apiFunObj.exec);
                            break;
                        case 'delete':
                            app.delete(url, apiFunObj.exec);
                            break;
                        default:
                    }
                }
            }
            else if(initExec !== undefined && initExec)
            {
                exec(apiFunObj.exec());
            }
        }

        app.all('*', function(req, res)
        {
            let result = new Result();
            result.result = 0;
            result.message = "404 Not Found";
            result.data = {};
            res.json(result);
        });
    });
}
