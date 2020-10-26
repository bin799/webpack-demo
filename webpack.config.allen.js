const path = require("path");
module.exports = {
    mode:'development', //production:生产模式、development：开发模式
    entry:"./src/index.js", //相对路径
    output:{
        filename:"index.js", //输入文件名称
        path:path.resolve(__dirname,"devDist") //输出路径为绝对路劲
    }
};