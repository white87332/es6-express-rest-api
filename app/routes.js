import index from '../api/index';

export default function(app)
{
    app.get('/', index);
}
