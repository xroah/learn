import {Configuration} from "webpack"
import HTMLWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"

export default (isDev = false) => {
    const cfg: Configuration = {
        mode: isDev ? "development" : "production",
        entry: {
            index: "./src/index.tsx"
        },
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx"]
        },
        module: {
            rules: [{
                test: /\.s?css$/,
                use: [
                    isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"]
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
            })
        ]
    }

    return cfg
}