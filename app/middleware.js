import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
// import favicon from 'serve-favicon';
import path from 'path';
import compression from 'compression';
import cors from 'cors';
import Result from '../class/result';

export default function(app)
{
    let rootPath = path.normalize(__dirname + '/..');

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session(
    {
        secret: 'cookie_secret',
        resave: true,
        saveUninitialized: true
    }));
    app.use(compression({threshold: 0}));
    app.use(express.static(rootPath+'/public'));
    // app.use(favicon(rootPath + '/public/favicon.ico'));
    app.use(function(req, res, next)
    {
        res.contentType('application/json');
        next();
    });
}
