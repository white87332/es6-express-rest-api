import Result from '../class/result';
import Logger from '../class/logger';
import Mongodb from '../class/Mongodb';

let result = new Result().getResult();
let log = new Logger().getLog();
let db = new Mongodb();

let a= {_id:'56a07d93fc77f7f03ee11e49'};

db.select("user", a, null,(err, res) =>{
    console.log(res);
});

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
