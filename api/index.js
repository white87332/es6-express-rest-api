import Result from '../class/result';
import Logger from '../class/logger';

let result = new Result().getResult();
let log = new Logger();

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

        // Promise.all([a(), b()]).then(function(data) { //cb
        //     // success
        //     console.log(data);
        // })
        // .catch(function(err) {
        //     // error
        //     console.log(err);
        // });

        // a().then((data) => {
        //     return b(data);
        // }).then((data)=>{
        //
        // }).catch((err) => {
        //     console.log(err);
        // });


        result.result = 1;
        result.message = "message";
        result.data = {};
        res.json(result);
    }

};

function a()
{
    return new Promise((resolve, reject) =>
    {
        resolve(
        {
            "email": "aszx87410@gmail.com",
            "name": "huli",
            "id": 5
        });
    });
}

function b()
{
    return new Promise((resolve, reject) =>
    {
        // resolve({"email":"aszx87410@gmail.com","name":"huli","id":6});
        reject(new Error("error"));
    });
}
