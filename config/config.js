const { resolve } = require("path")
const UPLOAD_PATH =  resolve(__dirname, "../static/uploads");
const LOW_CODE_SERVICE_PATH =  resolve(__dirname, "../static/lowCodeService");

module.exports = {
    paths: [UPLOAD_PATH, LOW_CODE_SERVICE_PATH]
}