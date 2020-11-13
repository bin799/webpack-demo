const path = require("path");
module.exports = {
    mode: 'development', //production:生产模式、development：开发模式
    entry: "./src/index.js", //相对路径
    output: {
        filename: "main.js", //输入文件名称
        path: path.resolve(__dirname, "dist") //输出路径为绝对路劲
    },
    devServer: {
        port: "3000", //指定开发服务器的端口
        progress: true, //显示开启本地服务器的进度
        contentBase: "./dist", //指定本地服务器默认打开的目录
        compress: true, //是否对代码惊醒压缩
        // gzip压缩
        compress: true,
        host: "0.0.0.0",
        historyApiFallback: true, // 如果为 true ，页面出错不会弹出 404 页面
    
    }
};