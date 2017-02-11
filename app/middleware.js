import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import compression from 'compression';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import { tokenSecret } from '../config/constants';

export default (app) =>
{
    let rootPath = path.normalize(`${__dirname}/..`);

    app.use((req, res, next) =>
    {
        let url = req.url;
        if (url.indexOf('contact') !== -1 ||
        url.indexOf('avatar') !== -1)
        {
            let auth = req.headers.authorization;
            let bearerAuth = !!auth;
            let token = bearerAuth ? auth.split(' ')[1] : '';
            jwt.verify(token, tokenSecret, (err) =>
            {
                if (err)
                {
                    res.json({
                        result: 0,
                        errorcode: '10201',
                        message: 'invalid token',
                        data: {}
                    });
                }
                else
                {
                    next();
                }
            });
        }
        else
        {
            next();
        }
    });

    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session(
        {
            secret: 'yueyquweyuqeyuoeyoqydasdas!@##%%',
            resave: true,
            saveUninitialized: true
        }));
    app.use(compression());
    app.use(express.static(`${rootPath}/public`));

    app.use((req, res, next) =>
    {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, Hashcash');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        // res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });
};
