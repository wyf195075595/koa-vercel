/*
 * @Description: 
 * @Author:  
 * @Date: 2023-06-06 11:17:27
 * @LastEditTime: 2023-06-28 17:23:45
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
    async getJsonByName(name) {
        let rs = null;
        let {code, results} = await db.query(`select * from mydb1024.lowcode_jsons where name='${name}'`);
        if(code == 200) {
            rs = results;
        }
        return rs;
    }
    async updateSchemaByName(name, json) {
        let sql = `update mydb1024.lowcode_jsons set schema_json= '${(json)}' where name='${name}'`;
        return await db.query(sql)
    }
    async updatePackageByName(name, json) {
        return await db.query(`update mydb1024.lowcode_jsons set package_json= '${json}' where name='${name}'`)
    }
    async updateAssetsByName(name, json) {
        return await db.query(`update mydb1024.lowcode_jsons set assets_json= '${json}' where name='${name}'`)
    }
    // lowCode json

    // world online

    // 获取技能列表
    async getAllSkills() {
        return await db.query(`
            SELECT list.*,
                GROUP_CONCAT(DISTINCT tag.name) AS tags,
                GROUP_CONCAT(DISTINCT wr.name) AS weaponRestrictions,
                type.name AS skillType,
                category.name AS professions,
                attackMode.name AS attackMode,
                attackRange.name AS attackRange
            FROM world_skills list
            LEFT JOIN world_skill_type type ON list.skill_type_id = type.id
            LEFT JOIN world_skill_category category ON list.professions_id = category.id
            LEFT JOIN world_attack_mode attackMode ON list.attack_mode_id = attackMode.id
            LEFT JOIN world_attack_range attackRange ON list.attack_range_id = attackRange.id
            LEFT JOIN world_status AS tag ON FIND_IN_SET(tag.id, list.tag_ids) > 0
            LEFT JOIN world_weapon_restrictions AS wr ON FIND_IN_SET(wr.id, list.weapon_restrictions_ids) > 0
            GROUP BY list.id;
        `)
    }

    // 获取下拉字典
    // 攻击方式
    async getAllDictionary(name) {
        return await db.query(`SELECT * from world_${name};`);
    }
    // world online
}
 
module.exports = new CommonModel();