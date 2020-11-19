const name = require("./name"); 
console.log(name);
//webpack只能打包处理js类型文件,无法处理非js类型的文件
//如果要处理非js的文件 需要手动安装第三方的加载器
//需要安装style-loader css-loader
import './css/index.css';
import "./less/index.less";
(()=>{
    let timer = async function timer() {
        return new Promise((reslove, reject) => {
            setTimeout(() => {
                reslove('a');
            }, 1000);
        })
    }
    timer().then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err.message);
    })

    //返回同步的值
    let sayHello = async function sayHello() {
        let hi = 'hello world'//等同于return Promise.resolve(hi);
        return hi
    }
    sayHello().then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err.message);
    })
})()



