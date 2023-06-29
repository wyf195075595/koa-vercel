function routerResponse(option = {}){
    return async function (ctx , next ){
        ctx.success = function(data){
            ctx.type = option.type || 'json';
            ctx.body = {
                code : option.successCode || 200,
                msg : option.successMsg || 'success',
                data : data
            }
        }
        ctx.fail = function (msg,code){
            ctx.type = option.type || 'json';
            ctx.body = {
                code : code ||option.failCode || 0,
                msg : msg || option.successMsg || 'fail'
            }
        }
        ctx.send = function({results, code}) {
            if(code === 200) {
                ctx.success(results);
            } else {
                ctx.fail(results, code);
            }
        }
        await next();
    }
}

module.exports = routerResponse