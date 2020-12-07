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
module.exports = {
    mode: 'production', //production:生产模式、development：开发模式
    entry: "./src/index.js", //相对路径
    output: {
        filename: "index.js", //输出文件名称
        path: path.resolve(__dirname, "dist") //输出路径为绝对路劲
    },
    devServer: {
        port: "3010", //指定开发服务器的端口
        progress: true, //显示开启本地服务器的进度
        contentBase: path.resolve(__dirname, "src"), //指定本地服务器默认打开的目录
        compress: true, //是否对代码惊醒压缩
        hot:true
        // // gzip压缩
        // compress: true,
        // host: "0.0.0.0",
        // historyApiFallback: true, // 如果为 true ，页面出错不会弹出 404 页面
    },
    plugins:[
        //第三步
        new webpack.HotModuleReplacementPlugin(), //new一个热更新的模块
        new htmlWebpackPlugin({// 添加plugins节点配置插件
            template:path.resolve(__dirname, 'src/index.html'),//模板路径
            filename:'index.html',//自动生成的HTML文件的名称(临时文件名称)
            minify: {
                removeAttributeQuotes: true,    // 是否去除文件中的双引号
                collapseWhitespace: true        // 是否去除文件中的空行
            },
            hash: true      // 引入文件的时候添加哈希值，防止缓存的问题
        }),
        new MiniCssExtractPlugin({        // 创建该插件的实例
            filename: 'index.css'    // 指定输出的css文件的文件名
        }),
        new webpack.ProvidePlugin({ //自动加载模块，而不必到处 import 或 require
            bin:'jquery' 
        })
    ],
    module:{//这个是第三方的加载器
        rules:[//正则的文件匹配规则
            {test:/\.(css|less)$/,use:[
                MiniCssExtractPlugin.loader, // 配置规则，将处理后的css代码直接输出到指定文件中
                // 'style-loader', //Adds CSS to the DOM by injecting a <style> tag   (style-loader与MiniCssExtractPlugin.loader不能共用)
                'css-loader',
                'less-loader',
                'postcss-loader'
            ]},
            {
                test: /\.(png|jpg|gif)$/, 
                use: 'url-loader?limit=43960'
            }, //使用webpack处理css中的路径;(use: 'url-loader?limit=43960')可以通过limit指定进行base64编码的图片大小；只有小于指定字节（byte）的图片才会进行base64编码：
        ]
    },
    optimization: { // 配置webpack的优化项
        minimize: true,
        minimizer: [   // 配置最小值优化项
          new CssMinimizerPlugin(),// 声明css优化插件的实例
        ],
    }
};