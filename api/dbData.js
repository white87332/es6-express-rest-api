import Result from '../class/result';
// import Mongodb from '../class/mongodb';
import Tingodb from '../class/tingodb';

let result = new Result().getResult();
// let db = new Mongodb();
let db = new Tingodb();

export default
{
    init()
    {
        return {
            initExec: false,
            routes: [
                {
                    method: 'get',
                    url: '/dbData/:collectin'
                },
                {
                    method: 'get',
                    url: '/dbData/:collectin/:id'
                },
                {
                    method: 'post',
                    url: '/dbData/:collectin'
                },
                {
                    method: 'put',
                    url: '/dbData/:collectin/'
                },
                {
                    method: 'delete',
                    url: '/dbData/:collectin/:id'
                }
            ]
        };
    },

    exec(req, res)
    {
        let body = req.body;
        let params = req.params;
        let query = req.query;

        // params
        let collectin = params.collectin;
        result.data = {};
        switch (req.method.toLowerCase())
        {
            case 'get':
                let skip = (Number.parseInt(query.skip, 10)) ? Number.parseInt(query.skip, 10) : 0;
                let limit = (Number.parseInt(query.limit, 10)) ? Number.parseInt(query.limit, 10) : 20;
                let sort = (query.sort === undefined) ? {} : JSON.parse(query.sort); //  object string

                let queryData = {};
                let conditionData = {};
                if (params.id !== undefined)
                {
                    queryData = {
                        _id: params.id
                    };
                }
                else
                {
                    conditionData = {
                        skip,
                        limit,
                        sort
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
                        result.message = 'get data successfully';
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
                        result.message = 'insert data successfully';
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
                        result.message = 'update data successfully';
                    }
                    res.json(result);
                });
                break;
            case 'delete':
                if (params.id === undefined)
                {
                    result.result = 0;
                    result.message = 'no id value';
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
                            result.message = 'delete data successfully';
                        }
                        res.json(result);
                    });
                }
                break;
            default:
        }
    }
};
