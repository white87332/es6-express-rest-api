import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import middleware from './middleware.js';
import routes from './routes.js';
import globalSet from './globalSet.js';

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
let httpServer = http.createServer(app);

// https
let pfx, pwd, httpsServer;
let pfxExists = fs.existsSync('./cert/server.pfx');
let pwExists = fs.existsSync('./cert/pw.txt');

if (pfxExists && pwExists)
{
    let options = {
        pfx: fs.readFileSync('./cert/server.pfx'),
        passphrase: fs.readFileSync('./cert/pw.txt')
    };

    httpsServer = https.createServer(options, app);
}

// socket.io
let io = require('socket.io')(httpServer);

// http start
httpServer.listen(httpPort);
console.log('http happens on port ' + httpPort);

// https start
if(pfxExists && pwExists)
{
    httpsServer.listen(httpsPort);
    console.log('https happens on port ' + httpsPort);
}
