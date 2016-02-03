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
                'url': '/dbData/:collectin/'
            },
            {
                'method': 'delete',
                'url': '/dbData/:collectin/:id'
            }]
        };
    },

    exec: function(req, res)
    {
        let body = req.body;
        let params = req.params;
        let query = req.query;

        // params
        let collectin = params.collectin;

        switch (req.method.toLowerCase())
        {
            case 'get':

                let skip = (Number.parseInt(query.skip))? Number.parseInt(query.skip) : 0;
                let limit = (Number.parseInt(query.limit))? Number.parseInt(query.limit) : 20;
                let sort = {} || JSON.parse(sort); //  object string

                let queryData, conditionData = {};
                if (params.id !== undefined)
                {
                    queryData = {
                        _id: params.id
                    };
                }
                else
                {
                    conditionData = {
                        skip:  skip,
                        limit: limit,
                        sort: sort
                    };
                }

                db.select(collectin, queryData, conditionData, (err, docs) =>
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
                db.update(collectin, body.where, body.set, (err, docs) =>
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
                    }
                    res.json(result);
                });
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
                        }
                        res.json(result);
                    });
                }
                break;
            default:
        }
    }
};
