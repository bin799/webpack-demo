const path = require("path");
module.exports = {
    mode:'development',
    entry:"./src/index.js",
    output:{
        filename:"demo-dist",
        path:path.resolve(__dirname,"dist")
    }
};