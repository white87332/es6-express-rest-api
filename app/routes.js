import fs from 'fs';
import { isArray } from 'util';
import Result from '../class/result';
import async from 'async';
import path from 'path';
import multipart from 'connect-multiparty';

let result = new Result().getResult();
let rootPath = path.normalize(__dirname + '/..');
let uploadOption = {
    uploadDir: rootPath + "/uploads/"
};

export default function(app)
{
    async.series(
        [
            function(callback)
            {
                fs.readdir('./api', (err, files) =>
                {
                    for (let fileName of files)
                    {
                        if (fileName !== '.DS_Store')
                        {
                            let apiFunObj = require('../api/' + fileName).default;
                            let { routes, initExec } = apiFunObj.init();
                            if ((initExec !== undefined && !initExec) && (isArray(routes) && routes.length > 0))
                            {
                                for (let route of routes)
                                {
                                    let url = route.url.toLowerCase();
                                    let method = route.method.toLowerCase();
                                    if (method === 'post')
                                    {
                                        app[route.method.toLowerCase()](url, multipart(uploadOption), apiFunObj.exec);
                                    }
                                    else
                                    {
                                        app[route.method.toLowerCase()](url, apiFunObj.exec);
                                    }
                                }
                            }
                            else if (initExec !== undefined && initExec)
                            {
                                apiFunObj.exec();
                            }
                        }
                    }

                    callback();
                });
            }
        ],
        function(err, results)
        {
            // app.all('*', (req, res) =>
            // {
            //     result.result = 0;
            //     result.message = "404 Not Found";
            //     result.data = {};
            //     res.json(result);
            // });

            app.get('*', function(req, res)
            {
                res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
            });
        });
}
