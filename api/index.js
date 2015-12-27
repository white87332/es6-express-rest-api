import Result from '../class/result';

export default function(req, res)
{
    let result = new Result();

    let a = {
        "test":"data"
    };

    result.result = 1;
    result.message = "new message";
    result.data = a;

    res.json(result);
}
