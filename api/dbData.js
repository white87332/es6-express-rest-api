import Result from '../class/result';
import Mongodb from '../class/Mongodb';

let result = new Result().getResult();
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
                'url': '/dbData/:collectin'
            },
            {
                'method': 'get',
                'url': '/dbData/:collectin/:id'
            },
            {
                'method': 'post',
                'url': '/dbData/:collectin'
            },
            {
                'method': 'put',
                'url': '/dbData/:collectin/:id'
            },
            {
                'method': 'delete',
                'url': '/dbData/:collectin/:id'
            }]
        };
    },

    exec: function(req, res, next)
    {
        let body = req.body;
        let params = req.params;
        let query = req.query;

        let collectin = params.collectin;
        switch (req.method.toLowerCase())
        {
            case 'get':
                let queryData = (params.id === undefined) ? {} : { _id: params.id };
                db.select(collectin, queryData, null, null, null, (err, docs) =>
                {
                    if (err)
                    {
                        result.result = 0;
                        result.message = err.message;
                    }
                    else
                    {
                        result.result = 1;
                        result.message = "get data successfully";
                        result.data = docs;
                    }
                    res.json(result);
                });
                break;
            case 'post':
                db.insert(collectin, body, (err, docs) =>
                {
                    if (err)
                    {
                        result.result = 0;
                        result.message = err.message;
                    }
                    else
                    {
                        result.result = 1;
                        result.message = "insert data successfully";
                        result.data = docs.ops;
                    }
                    res.json(result);
                });
                break;
            case 'put':
                if (params.id === undefined)
                {
                    result.result = 0;
                    result.message = "no id value";
                    res.json(result);
                }
                else
                {
                    let whereObject = {
                        _id: params.id
                    };
                    db.update(collectin, whereObject, body, (err, docs) =>
                    {
                        if (err)
                        {
                            result.result = 0;
                            result.message = err.message;
                        }
                        else
                        {
                            result.result = 1;
                            result.message = "update data successfully";
                            result.data = {};
                        }
                        res.json(result);
                    });
                }
                break;
            case 'delete':
                if (params.id === undefined)
                {
                    result.result = 0;
                    result.message = "no id value";
                    res.json(result);
                }
                else
                {
                    let whereObject = {
                        _id: params.id
                    };
                    db.delete(collectin, whereObject, (err, docs) =>
                    {
                        if (err)
                        {
                            result.result = 0;
                            result.message = err.message;
                        }
                        else
                        {
                            result.result = 1;
                            result.message = "delete data successfully";
                            result.data = {};
                        }
                        res.json(result);
                    });
                }
                break;
            default:
        }
    }
};
