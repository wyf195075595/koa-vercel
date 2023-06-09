/*
 * @Description: 
 * @Author:  
 * @Date: 2023-06-07 17:50:55
 * @LastEditTime: 2023-06-09 14:42:29
 * @LastEditors:  
 */
const fs = require('fs/promises');
const { existsSync, createReadStream, createWriteStream } = require('fs');
const { extname } = require('path');
// 根路径类型 0 普通上传路径， 1 低代码上传路径
const { paths } = require("../config/config");

const resultTips = {
    NOT_FOUNT_PATH: "找不到路径",
    FILE_TYPE_ERROR: "文件类型错误",
    DELETE_SUCCESS: "删除成功",
    DELETE_FAIL: "删除失败",
    UPDATE_SUCCESS: "修改成功",
    UPDATE_FAIL: "修改失败",
}

class FileUtils {
    /**
     * 删除文件夹，文件
     * @param {string} path 文件夹路径
     * @returns 操作结果
     * @returns {stirng} 提示
     */
    static async deleteDir(path) {
        let type = await FileUtils.getFileType(path);
        if(type === 0) return resultTips.NOT_FOUNT_PATH
        // 文件
        if(type === 1) {
            await FileUtils.deleteFile(path);
        } else if(type === 2) {
            // 文件夹
            let files = await fs.readdir(path);
            // 删除子文件
            if(files.length) {
                for await (let dir of files) {
                    let delPath = path + "/" + dir;
                    await FileUtils.deleteDir(delPath);
                } 
            }
            // 删除目录
            await fs.rmdir(path);
        } else {
            console.warn(resultTips.FILE_TYPE_ERROR);
            return resultTips.FILE_TYPE_ERROR;
        }
        return resultTips.DELETE_SUCCESS;
    }

    /**
     * 删除文件
     * @param {string} path 文件路径
     * @returns {stirng} 提示
     */
    static async deleteFile(path) {
        if(existsSync(path)) {
            try {
                await fs.rm(path);
                return resultTips.DELETE_SUCCESS;
            } catch (error) {
                return resultTips.DELETE_FAIL;
            }
        } else {
            let tips = `${resultTips.NOT_FOUNT_PATH} ：${path}`;
            console.warn(tips);
            return tips;
        }
    }

    /**
     * 获取文件类型
     * @param {string} path 
     * @return {number} 0 不存在， 1 文件，2文件夹
     */
    static async getFileType(path) {
        try {
            // 判断路径是否存在
            let isOk = existsSync(path);
            if(isOk) {
                // 是否文件夹
                let flag2 = (await fs.stat(path)).isDirectory();
                if(flag2) {
                    return 2
                }
                // 是否文件
                let flag1 = (await fs.stat(path)).isFile();
                if(flag1) {
                    return 1
                }
            }
        } catch (error) {
            console.warn(resultTips.NOT_FOUNT_PATH);
        }
        return 0;
    }

    /**
     * 
     * @param {File} file 文件file 
     * @param {stirng} fileName 新文件名
     * @param {stirng} pathType 根路径类型
     * @return {stirng} path 文件路径
     */
    static fileSave(file, fileName, pathType = 0) {
        const reader = createReadStream(file.filepath);	// 创建可读流
        const ext = extname(file.originalFilename);	// 获取上传文件扩展名
        let reletivePath = `/${file.originalFilename.slice(0, -ext.length)}_${(Math.random()*(10**16)).toFixed(0).toString()}${ext}` ;
        if(fileName) {
            reletivePath = fileName
        }
        const filePath = paths[pathType] +"/"+ reletivePath;
        const upStream = createWriteStream(filePath);// 创建可写流
        reader.pipe(upStream);	// 可读流通过管道写入可写流
        return filePath;
    }

    /**
     * 文件写入
     * @param {string} path 
     * @param {string} data 写入的数据 
     * @returns {stirng} 提示
     */
    static async fileWrite(path, data) {
        try {
            await fs.writeFile(path, data);
            return resultTips.UPDATE_SUCCESS;
        } catch (error) {
            console.warn(resultTips.UPDATE_FAIL + error);
            return resultTips.UPDATE_FAIL;
        }
    }
}

module.exports = FileUtils