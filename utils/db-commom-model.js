/*
 * @Description: 
 * @Author:  
 * @Date: 2023-06-06 11:17:27
 * @LastEditTime: 2023-06-09 18:13:14
 * @LastEditors:  
 */
const db = require('../utils/db-mysql');
const { v4: uuidv4 } = require('uuid');
 
class CommonModel {
    async updatePassword (id, password) {
        return await db.query(`update mydb1024.sys_user set password= '${password}'  where id = '${id}'`)
    }
    async updateUserName (id, username) {
        return await db.query(`update mydb1024.sys_user set username= '${username}'  where id = '${id}'`)
    }
    async delUser (id) {
        return await db.query(`delete from mydb1024.sys_user where id = '${id}'`)
    }
    async addUser (username, password) {
        let sql = `insert into mydb1024.sys_user(id, username, password) values('${uuidv4()}', '${username}', '${password}')`
        console.log(sql);
        return await db.query(sql)
    }
    async getUser () {
        return await db.query(`select * from mydb1024.sys_user`)
    }
    async getUserByName (username) {
        return await db.query(`select * from mydb1024.sys_user where username='${username}'`)
    }
    async getUserById (id) {
        return await db.query(`select * from mydb1024.sys_user where id='${id}'`)
    }

    // lowCode schema
    async getSchameList () {
        return await db.query(`select * from mydb1024.lowcode_pages`)
    }
}
 
module.exports = new CommonModel();