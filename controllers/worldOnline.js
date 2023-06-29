/*
 * @Description: 世界ol 接口
 * @Author:  wyf
 * @Date: 2023-06-28 16:08:41
 * @LastEditTime: 2023-06-29 09:00:55
 * @LastEditors: wyf 
 */

const model = require('../utils/db-commom-model');
const { codes } = require('../config/config');
var fn_getSkills = async (ctx, next) => {
    let rs = await model.getAllSkills();
    ctx.send(rs)
}

var fn_getDictByCode = async (ctx, next) => {
    let { code } = ctx.request.query;
    let data = await model.getAllDictionary(codes[code]);
    ctx.send(data);
}
module.exports = {
    'GET /getDictByCode': fn_getDictByCode,
    'GET /getSkills': fn_getSkills,
};