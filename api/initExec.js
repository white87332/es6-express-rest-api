export default function()
{
    return {
        init : function()
        {
            return {
                initExec: false
            };
        },

        exec : function()
        {
            console.log("init exec");
        }
    };
}
