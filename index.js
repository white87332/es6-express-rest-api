import express from 'express';
import http from 'http';
import https from 'spdy';
import fs from 'fs';
import middleware from './app/middleware.js';
import routes from './app/routes.js';
import globalSet from './app/globalSet.js';

let app = express();

// middleware
middleware(app);

// routes
routes(app);

// globalSet
globalSet();

// port
let httpPort = process.env.PORT || 3000;
let httpsPort = process.env.HTTPS_PORT || 3443;

// http
let httpServer = http.createServer(app).listen(httpPort);
console.log('http happens on port ' + httpPort);

// https
if(fs.existsSync('./cert/server.pfx'))
{
    let options = {
        pfx: fs.readFileSync('./cert/server.pfx'),
        passphrase: ''
    };

    let httpsServer = https.createServer(options, app).listen(httpsPort);
    console.log('https happens on port ' + httpsPort);
}

// socket.io
// let io = require('socket.io')(httpServer);
