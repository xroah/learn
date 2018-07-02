const MINI_CSS_EXTRACT_PLUGIN = require("mini-css-extract-plugin");
const YARGS = require("yargs");

let mod = YARGS.argv.module;

let entry;
//如果输入了webpack --module mod，则打包该模块
//否则全部打包
if (mod) {
    entry = {
        [mod]: `./${mod}/index.js`
    }
} else {
    entry = {
        MultiSelect: "./multiSelect/index.js",
        cookie: "./cookie/index.js"
    }
}

module.exports = {
    mode: "production",
    entry,
    devtool: "source-map",
    output: {
        path: `${__dirname}/dist`,
        filename: "[name]/jquery.[name].min.js",
        library: ["[name]"],
        libraryTarget: "umd"
    },
    module: {
        rules: [{
            test: /.js$/,
            use: "babel-loader",
            exclude: /node_modules/
        },{
            test: /.s?css$/,
            use: [
                MINI_CSS_EXTRACT_PLUGIN.loader,
                {
                    loader: "css-loader",
                    options: {
                        minimize: true, 
                        sourceMap: true
                    }
                },
                "sass-loader"
            ]
        }]
    },
    plugins: [
        new MINI_CSS_EXTRACT_PLUGIN({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name]/jquery.[name].min.css"
          })
    ],
    externals: "jquery"
};