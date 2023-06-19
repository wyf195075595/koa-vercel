/*
 * @Description: 
 * @Author:  
 * @Date: 2023-06-06 11:08:25
 * @LastEditTime: 2023-06-19 12:01:27
 * @LastEditors:  
 */
const database = {
    HOST: 'mysql.sqlpub.com', //数据库地址
    USER: 'sysadmin',
    PASSWORD: process.env.MYSQL_PWD,//process.env.MYSQL_PWD
    DATABASE: 'mydb1024'    //数据库名称
  }
  module.exports = { database }