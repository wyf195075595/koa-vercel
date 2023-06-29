/*
 * @Description: 
 * @Author:  
 * @Date: 2023-06-07 17:06:07
 * @LastEditTime: 2023-06-21 08:36:39
 * @LastEditors:  
 */
const FileUtils = require('../utils/fileUtils');
const send = require('koa-send');
const path = require('path');
const model = require('../utils/db-commom-model');
const fn_uploadFile = async (ctx, next) => {
    const file = ctx.request.files.file;	// 获取上传文件
    const {fileName = file.originalFilename, pathType = 0} = ctx.request.body;
    try {
        let rs = FileUtils.fileSave(file,fileName, pathType);
        ctx.success({
            data: rs
        })

    } catch (error) {
        ctx.fail({
            data: error
        })
    }
}

const fn_deleteFile = async (ctx, next) => {
    const path = ctx.request.query.path;
    try {
        let rs = await FileUtils.deleteFile(path);
        ctx.success({
            data: rs
        })

    } catch (error) {
        ctx.fail({
            data: error
        })
    }
}

var fn_getFile = async (ctx, next) => {
    const {name, path} = ctx.request.query; //'assets.json', '/lowCodeService/'
    const dir = path.join(__dirname,'../static/', path);
	ctx.attachment(name);//下载文件名称
    try {
        await send(ctx, name, {root: dir})
    } catch (error) {
      ctx.throw(404, '文件不存在')
    }
};
// 读写本地 json 文件, 但是 vercel 中文件为只读
const fn_updateScameFile_local = async (ctx, next) => {
    const json = ctx.request.body;
    let rs = await FileUtils.fileWrite(path.join(__dirname, "../static/lowCodeService/schema.json"), json);
    ctx.success({
        data: rs
    })
}
const fn_updatePackageFile_local = async (ctx, next) => {
    const json = ctx.request.body;
    let rs = await FileUtils.fileWrite(path.join(__dirname, "../static/lowCodeService/package.json"), json);
    ctx.success({
        data: rs
    })
}
const fn_updateLowCodeServiceFile_local = async (ctx, next) => {
    const { json, fileName} = JSON.parse(ctx.request.body);
    let rs = await FileUtils.fileWrite(path.join(__dirname, "../static/lowCodeService/", fileName), JSON.stringify(json));
    ctx.success({
        data: rs
    })
}
var fn_getFileFromLowCodeService = async (ctx, next) => {
    const name = ctx.request.query.name; //'assets.json';
    const dir = path.join(__dirname,'../static/','/lowCodeService/');
	ctx.attachment(name);//下载文件名称
    try {
        await send(ctx, name, {root: dir})
    } catch (error) {
      ctx.throw(404, '文件不存在')
    }
};

// 读写数据库
const fn_getJsonByName = async (ctx, next) => {
    const {name} = ctx.request.query;
    let rs = await model.getJsonByName(name);
    ctx.success({
        data: rs
    })
}
const fn_updateScameFile = async (ctx, next) => {
    const {json, name} = JSON.parse(ctx.request.body);
    let rs = await model.updateSchemaByName(name, JSON.stringify(json));
    ctx.success({
        data: rs
    })
}
const fn_updatePackageFile = async (ctx, next) => {
    const {json, name} = JSON.parse(ctx.request.body);
    let rs = await model.updatePackageByName(name, JSON.stringify(json));
    ctx.success({
        data: rs
    })
}
const fn_updateAssetsFile = async (ctx, next) => {
    const {json, name} = JSON.parse(ctx.request.body);
    let rs = await model.updateAssetsByName(name, JSON.stringify(json));
    ctx.success({
        data: rs
    })
}

module.exports = {
    'GET /getFile': fn_getFile,
    'POST /uploadFile': fn_uploadFile,
    'GET /deleteFile': fn_deleteFile,
    
    'POST /updateScameFile': fn_updateScameFile,
    'POST /updatePackageFile': fn_updatePackageFile,
    'POST /updateAssetsFile': fn_updateAssetsFile,
    'GET /getJsonByName': fn_getJsonByName,
};