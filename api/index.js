import Result from '../class/result';
import Logger from '../class/logger';
import Mongodb from '../class/Mongodb';

let result = new Result().getResult();
let log = new Logger().getLog();
let db = new Mongodb();

export default
{
    init: function()
    {
        return {
            initExec: false,
            routes: [
            {
                'method': 'get',
                'url': '/'
            }]
        };
    },

    exec: function(req, res, next)
    {
        let body = req.body;
        let params = req.params;
        let query = req.query;

        result.result = 1;
        result.message = "message";
        result.data = {};
        res.json(result);
    }
};
