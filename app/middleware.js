import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import compression from 'compression';

export default function(app)
{
    return new Promise((resolve, reject) => {
        let rootPath = path.normalize(__dirname + '/..');

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(session(
        {
            secret: 'yueyquweyuqeyuoeyoqydasdas!@##%%',
            resave: true,
            saveUninitialized: true
        }));
        app.use(compression());
        app.use(express.static(rootPath + '/public'));

        app.use((req, res, next) =>
        {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
            res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
            // res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });
        resolve();
    });
}
