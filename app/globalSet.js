import logger from '../class/logger';

export default function()
{
    return new Promise((resolve, reject) => {
        global.log = new logger().getLog();
        resolve();
    });
}
