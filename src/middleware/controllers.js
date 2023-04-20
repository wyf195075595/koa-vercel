const fs = require('fs');
const path = require('path')
function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}
function addControllers(router, controllers_dir) {
    var files = fs.readdirSync(path.join(__dirname,'../','/'+controllers_dir));
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });
    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(path.join(__dirname,'../','/'+controllers_dir+'/') + f);
        addMapping(router, mapping);
    }
}
module.exports = function (dir) {
    let controllers_dir = dir || 'controllers', // 如果不传参数，扫描目录默认为'controllers'
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};