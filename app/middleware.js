import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
// import favicon from 'serve-favicon';
import path from 'path';
import compression from 'compression';
import cors from 'cors';
import uuid from 'node-uuid';

export default function(app)
{
    let rootPath = path.normalize(__dirname + '/..');

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session(
    {
        secret: uuid.v1(),
        resave: true,
        saveUninitialized: true
    }));
    app.use(compression());
    app.use(express.static(rootPath + '/public'));

    // prerender-node
    app.use(require('prerender-node').set('prerenderServiceUrl', 'http://localhost:3000/'));

    // app.use(favicon(rootPath + '/public/favicon.ico'));
    app.use((req, res, next) =>
    {
        res.contentType('application/json');
        res.set('Cache-Control', 'no-cache');
        next();
    });
}
