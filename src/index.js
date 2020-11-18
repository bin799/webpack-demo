const name = require("./name"); 
console.log(name);
//webpack只能打包处理js类型文件,无法处理非js类型的文件
//如果要处理非js的文件 需要手动安装第三方的加载器
//需要安装style-loader css-loader
import './css/index.css'