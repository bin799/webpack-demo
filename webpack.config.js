const path = require("path");
module.exports = {
    mode:'production', //production:生产模式、development：开发模式
    entry:"./src/index.js", //相对路径
    output:{
        filename:"main.js", //输入文件名称
        path:path.resolve(__dirname,"dist") //输出路径为绝对路劲
    }
};