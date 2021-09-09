const HTMLWebpackPlugin = require("html-webpack-plugin")
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const webpack = require("webpack")

module.exports = env => {
    const mode = env.dev ? "development" : "production"
    const isDev = mode === "development"
    const devPlugins = []
    let devServer
    
    process.env.NODE_ENV = process.env.BABEL_ENV = mode

    if (isDev) {
        devServer = {
            port: 8000,
            // open: true,
            https: true,
            host: "0.0.0.0",
            hot: true,
            proxy: {
                "/websocket": {
                    target: "ws://localhost:5678",
                    ws: true,
                    pathRewrite: {
                        "^/websocket/": "/"
                    }
                }
            }
        }

        devPlugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new ReactRefreshPlugin()
        )
    }

    return {
        mode,
        entry: {
            index: "./src/index.tsx"
        },
        devtool: "eval-source-map",
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx"]
        },
        externals: isDev ? undefined : {
            "react": "React",
            "react-dom": "ReactDOM",
            "react-router-dom": "ReactRouterDOM"
        },
        module: {
            rules: [{
                test: /\.s?css$/,
                use: [isDev && "style-loader", "css-loader", "sass-loader"].filter(Boolean)
            }, {
                test: /\.[jt]sx?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: [
                          isDev && "react-refresh/babel",
                        ].filter(Boolean),
                      },
                },
                exclude: /node_modules/
            }]
        },
        plugins: [
            new HTMLWebpackPlugin({
                template: "./index.html",
                hash: true,
                inject: "body",
                reactCDN: isDev ? "" :
                `
                <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
                <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
                <script crossorigin src="https://unpkg.com/react-router-dom@5.2.0/umd/react-router-dom.min.js"></script>
                `
            }),
            ...devPlugins
        ],
        devServer
    }
}
