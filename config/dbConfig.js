/*
 * @Description: 数据据库配置
 * @Author:  wfy
 * @Date: 2023-06-06 11:08:25
 * @LastEditTime: 2023-06-29 09:00:23
 * @LastEditors: wyf 
 */
const database = {
    HOST: 'mysql.sqlpub.com', //数据库地址
    USER: 'sysadmin',
    PASSWORD: process.env.MYSQL_PWD,
    DATABASE: 'mydb1024'    //数据库名称
  }
  module.exports = { database }