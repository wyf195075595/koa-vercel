const { resolve } = require("path")
const UPLOAD_PATH =  resolve(__dirname, "../static/uploads");
const LOW_CODE_SERVICE_PATH =  resolve(__dirname, "../static/lowCodeService");

// 字典code
const codes = {
    10010: "attack_mode",// 攻击方式
    10011: "attack_range",// 攻击范围
    10012: "equipment_quality",// 装备品质
    10013: "equipment_type",// 装备类型
    10014: "professions",// 角色职业
    10015: "skill_category",// 技能分类
    10016: "skill_type",// 技能类型
    10017: "status",// 状态
    10018: "weapon_restrictions",// 武器限制
};

module.exports = {
    paths: [UPLOAD_PATH, LOW_CODE_SERVICE_PATH],
    codes
}