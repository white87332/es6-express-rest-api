import express from 'express';
import http from 'http';
import https from 'spdy';
import fs from 'fs';
import middleware from './app/middleware';
import routes from './app/routes';
import globalSet from './app/globalSet';

let app = express();

globalSet();
middleware(app);
routes(app);

// port
let httpPort = process.env.PORT || 80;
let httpsPort = process.env.HTTPS_PORT || 443;

// http
http.createServer(app).listen(httpPort);
console.log(`http happens on port ${httpPort}`);

// https
if (fs.existsSync('./cert/server.pfx'))
{
    let options = {
        pfx: fs.readFileSync('./cert/server.pfx'),
        passphrase: ''
    };

    https.createServer(options, app).listen(httpsPort);
    console.log(`https happens on port ${httpsPort}`);
}

// mkfir logs
if (!fs.existsSync('./logs'))
{
    fs.mkdir('./logs');
}

// mkfir uploads
if (!fs.existsSync('./uploads'))
{
    fs.mkdir('./uploads');
}
