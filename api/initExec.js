export default function()
{
    return {
        init : function()
        {
            return {
                initExec: true
            };
        },

        exec : function()
        {
            console.log("init exec");
        }
    };
}
