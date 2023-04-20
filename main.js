/*
 * @Description: 
 * @Author:  
 * @Date: 2023-04-20 16:04:35
 * @LastEditTime: 2023-04-20 17:11:33
 * @LastEditors:  
 */
const Koa = require('koa');
const app = new Koa();

// 跨域处理
const cors = require('koa-cors');
app.use(cors());

// 设置静态资源
const static = require('koa-static');
app.use(static(__dirname+ '/static'))


// 设置响应格式
const routerResponse = require('./middleware/routerResponse');
app.use(routerResponse({
    code:200,
}))

// 获取post请求参数
const bodyparser = require('koa-bodyparser');
app.use(bodyparser())

// 注册路由
const controller = require('./middleware/controllers');
app.use(controller());




app.listen(3030,()=>{
	console.log('port 3030 is running!')
});