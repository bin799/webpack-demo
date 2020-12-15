// module:option-esModule:false 不支持es6已经语法

// outputPath负责输出目录, 即打包后的写在磁盘的位置.
// publicPath用来指定资源的请求位置,比如img标签引入或者css引入等;（添加引用路径前缀）
//区别 
// path是webpack所有文件的输出的路径，必须是绝对路径，比如：output输出的js,url-loader解析的图片，HtmlWebpackPlugin生成的html文件，都会存放在以path为基础的目录下
// publicPath 并不会对生成文件的路径造成影响，主要是对你的页面里面引入的资源的路径做对应的补全，常见的就是css文件里面引入的图片
//例子
// import Img from './img.jpg';
// outputPath: 'static/img/',
// publicPath: './dist/static/img/'
// publicPath有3种形式:
// 1、HTML相关
// 我们可以将publicPath指定为HTML的相对路径，在请求这些资源时会以当前页面HTML所在路径加上相对路径，构成实际请求的URL
// //假设当前html地址为：https://www.example.com/app/index.html
// //异步加载的资源名为 1.chunk.js
// pubilicPath:"" 		//-->https://www.example.com/app/1.chunk.js
// pubilicPath:"./js" 	//-->https://www.example.com/app/js/1.chunk.js
// pubilicPath:"../assets/"  	//-->https://www.example.com/assets/1.chunk.js
// 2、Host相关
// 若publicPath的值以“/”开始，则代表此时publicPath是以当前页面的host name为基础路径的;
// //假设当前html地址为：https://www.example.com/app/index.html
// //异步加载的资源名为 1.chunk.js
// pubilicPath:"/" 	//-->https://www.example.com/1.chunk.js
// pubilicPath:"/js/" 	//-->https://www.example.com/js/1.chunk.js
// 3、CDN相关
// 上面两个都是相对路径，我们也可以使用绝对路径的形式配置publicPath
// 这种情况一般发生于静态资源放在CDN上面时，由于其域名与当前页面域名不一致，需要以绝对路径的形式进行指定
// 当publicPath以协议头或相对协议的形式开始时，代表当前路径是CDN相关
// //假设当前html地址为：https://www.example.com/app/index.html
// //异步加载的资源名为 1.chunk.js
// pubilicPath:"http://cdn.com/" 	//-->http://cdn.com/1.chunk.js
// pubilicPath:"https://cdn.com/"	//-->https://cdn.com/1.chunk.js
// pubilicPath:"//cdn.com/assets"	//-->//cdn.com/assets/1.chunk.js

// 开发多页面应用时经常会出现代码需要多处使用的情况，比如官网的头部和底部，而复制粘贴又太low，所以我们需要实现代码复用。
// 在这里使用到的是html-withimg-loader这个loader，这个loader可以代替html-loader解决html中的图片加载问题，而且支持代码复用。
// <div>
// #include("./layout/top.html")
// <!--子页面将被引入，并且子页面中的img标签同样会进行处理-->
// </div>
// 复用html所需的css和js需在使用到的页面的js文件中引入
const path = require("path");
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
// html-webpack-plugin这个插件的两个作用：
//  1. 自动在内存中根据指定页面生成一个内存的页面
//  2. 自动把打包好的 bundle.js 追加到页面中去
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//独立分离Css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
//压缩css（cssnano的webpack使用）
let TerserJSPlugin = require('terser-webpack-plugin');   
// 压缩js
let {CleanWebpackPlugin} = require('clean-webpack-plugin');

// 当页面较多时，可以使用动态加载文件的方式来引入：
const fs = require("fs");
let htmlPlugins = [];
const files = fs.readdirSync(path.resolve(__dirname, "src/view"));
htmlPlugins = files.map((item) => {
    return new htmlWebpackPlugin({
        filename: item,
        template: `./src/view/${item}`,
        chunks: [item.split(".")[0]],
        hash: true 
    });
});

module.exports = {
    mode: 'production', //production:生产模式、development：开发模式
    // externals: { //防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
    //     jquery: 'jQuery'
    // },
    devtool: "eval-source-map", //Webpack的源码映射(1、source-map：会产生单独的映射文件2、eval-source-map：不会产生单独的映射文件)
    entry: {
        //设置多个入口
        index:"./src/js/index.js",
        vender:"./src/js/vender.js",
    }, //相对路径
    output: {
        filename: "js/[name]_[hash].js", //输出文件名称
        // [name]可以指代chunk name
        // [hash]：指代Webpack此次打包所有资源生成的hash
        // [chunkhash]：指代当前chunk内容的hash
        // [id]：指代当前chunk的id
        // [query]：指代filename配置项中的query
        // hash、chunkhash：控制客户端缓存
        path: path.resolve(__dirname, "dist") //输出路径为绝对路劲
    },
    devServer: {
        port: "3010", //指定开发服务器的端口
        progress: true, //显示开启本地服务器的进度
        contentBase: path.resolve(__dirname, "src"), //指定本地服务器默认打开的目录
        compress: true, //是否对代码进行压缩
        hot:true
        // // gzip压缩
        // compress: true,
        // host: "0.0.0.0",
        // historyApiFallback: true, // 如果为 true ，页面出错不会弹出 404 页面
    },
    plugins:[
        //第三步
        new webpack.HotModuleReplacementPlugin(), //new一个热更新的模块
        // new htmlWebpackPlugin({// 添加plugins节点配置插件
        //     template:path.resolve(__dirname, 'src/view/index.html'),//模板路径
        //     filename:'index.html',//自动生成的HTML文件的名称(临时文件名称)
        //     minify: {
        //         removeAttributeQuotes: true,    // 是否去除文件中的双引号
        //         collapseWhitespace: true        // 是否去除文件中的空行
        //     },
        //     chunks: ['index'], //指定引入的js文件
        //     hash: true      // 引入文件的时候添加哈希值，防止缓存的问题
        // }),
        // new htmlWebpackPlugin({// 添加plugins节点配置插件
        //     template:path.resolve(__dirname, 'src/view/vender.html'),//模板路径
        //     filename:'vender.html',//自动生成的HTML文件的名称(临时文件名称)
        //     minify: {
        //         removeAttributeQuotes: true,    // 是否去除文件中的双引号
        //         collapseWhitespace: true        // 是否去除文件中的空行
        //     },
        //     chunks:["vender"],
        //     hash: true      // 引入文件的时候添加哈希值，防止缓存的问题
        // }),
        ...htmlPlugins,
        new MiniCssExtractPlugin({        // 创建该插件的实例
            filename: 'css/index.css'    // 指定输出的css文件的文件名
        }),
        // new webpack.ProvidePlugin({ //自动加载模块，而不必到处 import 或 require
        //     bin:'jquery' 
        // })
        // 参数是你要一个字符串，值是你要添加的版权声明信息
        new webpack.BannerPlugin('Made by BinBin'),
        new CleanWebpackPlugin()
    ],
    module:{//这个是第三方的加载器
        rules:[//正则的文件匹配规则
            {test:/\.(css|less)$/,use:[
                {
                    loader:MiniCssExtractPlugin.loader,
                    options:{
                        publicPath: '../'
                    }
                }, // 配置规则，将处理后的css代码直接输出到指定文件中
                // 'style-loader', //Adds CSS to the DOM by injecting a <style> tag   (style-loader与MiniCssExtractPlugin.loader不能共用)
                'css-loader',
                'less-loader',
                'postcss-loader'
            ]},
            {
                test: /\.js$/,      // 匹配js文件，然后用下面所配置的工具对这些文件进行编译处理
                use: {
                    loader: 'babel-loader',     // babel的核心模块
                    options: {
                        presets: [              // 配置babel的预设，将ES语法转成ES5语法,更高级的es7以上语法需要单独配置
                            '@babel/preset-env'
                        ],
                        plugins: [  // 配置babel插件，转换更更高版本语法
                            '@babel/plugin-proposal-class-properties' //编译 class
                        ]
                    }
                }
            },
            // {
            //     test: /\.(png|jpg|jpeg|gif)$/,   
            //     use: {
            //         loader: 'file-loader',
            //         options:{
            //             esModule:false //不支持es6已经语法
            //         }    
            //     }
            // },
            {
                test: /\.(png|jpg|jpeg|gif)$/, 
                use: {
                    loader: 'url-loader',//url-loader 功能类似于 file-loader，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。 file-loader与 url-loader不能共用;
                                         //使用webpack处理css中的路径;(use: 'url-loader?limit=43960')可以通过limit指定进行base64编码的图片大小；只有小于指定字节（byte）的图片才会进行base64编码：
                                         //优化图片处理方式，减少http请求
                    options: {
                      limit: 10*1024, 
                      outputPath: './image/', //设置图片输出路径 
                      esModule:false //不支持es6已经语法
                    }
                }
            }, 
            {
                test: /\.html$/,
                use: {
                    loader:'html-withimg-loader' //处理 .html 文件中引用的图片，使得图片能够被正常使用;在file-loader或者url-loader的基础上
                }
            },
            
           
        ]
    },
    optimization: { // 配置webpack的优化项
        minimize: true,
        minimizer: [   // 配置最小值优化项
          new CssMinimizerPlugin(),// 声明css优化插件的实例
        ],
        splitChunks:{ 
            minSize: 30000, // 3kb   表示在压缩前的最小模块大小,默认值是30kb
            chunks:'all',//同时分割同步和异步代码,推荐。
            automaticNameDelimiter:'_',//名称分隔符，默认是~
            cacheGroups: {  //默认的规则不会打包,需要单独定义
                jquery: { // 将jquery抽出来
                    name:'jquery',
                    chunks: 'all',
                    test: /jquery\.js/,
                    enforce: true
                }
            }
          }
    }
};
