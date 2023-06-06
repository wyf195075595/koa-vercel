/*
 * @Description: 
 * @Author:  
 * @Date: 2023-06-06 11:05:02
 * @LastEditTime: 2023-06-06 15:14:05
 * @LastEditors:  
 */
var fn_index = async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
};

var fn_signin = async (ctx, next) => {
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    if (name === 'koa' && password === '12345') {
        ctx.success({
            ok:'xxxxx'
        })
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
};

module.exports = {
    'GET /login': fn_index,
    'POST /signin': fn_signin
};