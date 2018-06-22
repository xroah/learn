const MINI_CSS_EXTRACT_PLUGIN = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    entry: {
        MultiSel: "./multiSelect"
    },
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
            filename: "[name]/[name].min.css"
          })
    ],
    externals: "jquery"
};