import express from 'express';
import middleware from './middleware.js';
import routes from './routes.js';

let app = express();
let port = process.env.PORT || 3000;

middleware(app);
routes(app);

app.listen(port);
console.log('Magic happens on port ' + port);
