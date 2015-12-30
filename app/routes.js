import fs from 'fs';
import util from 'util';
import Result from '../class/result';

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
                    app[route.method.toLowerCase()](url, apiFunObj.exec);
                }
            }
            else if(initExec !== undefined && initExec)
            {
                apiFunObj.exec();
            }
        }

        app.all('*', function(req, res)
        {
            let result = new Result().getResultFormat();
            result.result = 0;
            result.message = "404 Not Found";
            result.data = {};
            res.json(result);
        });
    });
}
