import express from 'express';
import middleware from './middleware.js';
import routes from './routes.js';
import http from 'http';

let app = express();
let port = process.env.PORT || 3001;

middleware(app);
routes(app);

let server = http.createServer(app);
let io = require('socket.io').listen(server);
io.on('connection', function(){});
server.listen(port);

console.log('Magic happens on port ' + port);
