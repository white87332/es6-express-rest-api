import logger from '../class/logger';

export default function()
{
    global.log = new logger().getLog();
}
