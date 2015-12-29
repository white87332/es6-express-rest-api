import Result from '../class/result';
import Logger from '../class/Logger';

let result = new Result().getResultFormat();
let log = new Logger();

export default function()
{
    return {
        init : function()
        {
            return {
                initExec : false,
                routes : [
                    {'method' : 'get', 'url' : '/'}
                ]
            };
        },

        exec : function(req, res, next)
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
}
