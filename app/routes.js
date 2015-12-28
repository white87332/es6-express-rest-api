import fs from 'fs';

export default function(app)
{
    fs.readdir('./api', (err, files) =>
    {
        for (let fileName of files)
        {
            let apiFunObj  = require('../api/' + fileName)();
            let configs = apiFunObj.init();

            for (let config of configs)
            {
                let method = config.method.toLowerCase();
                let url = config.url.toLowerCase();

                switch (method)
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
    });
}
