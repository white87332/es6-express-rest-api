import Result from '../class/result';

let result = new Result().getResult();

export default
{
    init()
    {
        return {
            initExec: false,
            routes: [
                { method: 'get', url: '/' },
                { method: 'post', url: '/' },
            ]
        };
    },

    exec(req, res)
    {
        // let body = req.body;
        // let params = req.params;
        // let query = req.query;

        result.result = 1;
        result.message = 'message';
        result.data = {};
        res.json(result);
    }
};
