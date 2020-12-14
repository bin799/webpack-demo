import $ from 'jquery';
console.log("$",$)
const name = require("./name"); 
console.log(name);
//webpack只能打包处理js类型文件,无法处理非js类型的文件
//如果要处理非js的文件 需要手动安装第三方的加载器
//需要安装style-loader css-loader
import './css/index.css';
import "./less/index.less";
(()=>{
   console.lo("test-devtool");
   console.log(location.protocol + "//" + location.host,process.env.BASE_URL,process.env.NODE_ENV)
})()

class A {
   className = 'A' 
}

let a = new A();
console.log(a);