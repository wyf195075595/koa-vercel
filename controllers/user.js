/*
 * @Description: 
 * @Author:  
 * @Date: 2023-06-06 11:51:47
 * @LastEditTime: 2023-06-06 15:08:18
 * @LastEditors:  
 */
const model = require("../utils/db-commom-model");

// 获取所有的用户
var getUser = async (ctx, next) => {
    const {id, username} = ctx.query;
    let rs = null;
    if(id) {
        rs = await model.getUserById(id);
    } else if(username) {
        rs = await model.getUserByName(username);
    }
    ctx.success({
        data: rs
    })
}

var addUser = async (ctx, next) => {
    var username = ctx.request.body.username || '',
        password = ctx.request.body.password || '';
    let rs = await model.addUser(username, password);
    ctx.success({
        data: rs
    })
}

var delUser = async (ctx, next) => {
    var id = ctx.query.id;
    let rs = await model.delUser(id);
    ctx.success({
        data: rs
    })
}

var updateUserName = async (ctx, next) => {
    const {id, username} = ctx.request.body;
    let rs = await model.updateUserName(id, username);
    ctx.success({
        data: rs
    })
}

var updatePassword = async (ctx, next) => {
    const {id, password} = ctx.request.body;
    let rs = await model.updatePassword(id, password);
    ctx.success({
        data: rs
    })
}
module.exports = {
    'GET /getUser': getUser,
    'POST /addUser': addUser,
    'GET /delUser': delUser,
    'POST /updateUserName': updateUserName,
    'POST /updatePassword': updatePassword,
};