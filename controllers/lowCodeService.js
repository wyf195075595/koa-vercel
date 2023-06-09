/*
 * @Description: 用户操作相关接口
 * @Author:  
 * @Date: 2023-06-06 11:51:47
 * @LastEditTime: 2023-06-09 18:15:27
 * @LastEditors:  
 */
const model = require("../utils/db-commom-model");

// 获取所有的用户
var fn_getSchameList = async (ctx, next) => {
    let rs =  await model.getSchameList();
    ctx.success({
        data: rs
    })
}

var fn_addSchame = async (ctx, next) => {
    // var {} = ctx.request.body;
    // let rs = await model.addUser(username, password);
    ctx.success({
        data: "未开发"
    })
}

module.exports = {
    'GET /getSchameList': fn_getSchameList,
    'POST /addSchame': fn_addSchame,
};