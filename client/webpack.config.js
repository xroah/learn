const HTMLWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")

module.exports = env => {
    const mode = env.dev ? "development" : "production"
    const isDev = mode === "development"
    let devServer

    if (isDev) {
        devServer = {
            port: 8000,
            open: true,
            hot: true
        }
    }

    return {
        mode,
        entry: {
            index: "./src/index.js"
        },
        module: {
            rules: [{
                test: /\.css$/,
                use: [isDev ? "style-loader" : "", "css-loader"].filter(Boolean)
            }, {
                test: /\.js$/,
                use: "babel-loader"
            }]
        },
        plugins: [
            new HTMLWebpackPlugin({
                template: "./index.html",
                hash: true
            }),
            isDev ? new webpack.HotModuleReplacementPlugin() : ""
        ].filter(Boolean),
        devServer
    }
}