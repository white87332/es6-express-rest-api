import Result from '../class/result';

export default function()
{
    return {
        init : function()
        {
            return [
                {'method' : 'get', 'url' : '/'}
            ];
        },

        exec : function(req, res, next)
        {
            let body = req.body;
            let params = req.params;
            let query = req.query;

            let result = new Result();
            result.result = 1;
            result.message = "message";
            result.data = {};
            res.json(result);
        }
    };
}
