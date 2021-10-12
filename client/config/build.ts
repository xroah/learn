import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack from "webpack"
import common from "./common"
import path from "path"
import fs from "fs"

const baseConf = common()

baseConf.plugins!.push(
    new MiniCssExtractPlugin({
        filename: "css/style.min.css"
    }),
    new webpack.ProgressPlugin()
)

baseConf.externals = {
    "react": "React",
    "react-dom": "ReactDOM",
    "react-router-dom": "ReactRouterDOM"

}
baseConf.output = {
    path: path.resolve("./dist"),
    filename: "js/index.min.js"
}

try {
    fs.rmdirSync(
        path.resolve(__dirname, "..", "dist"),
        {recursive: true}
    )
} catch (error) {}

webpack(baseConf, (err, stats) => {
    if (err || stats?.hasErrors()) {
        if (stats) {
            const errors = stats.toJson().errors?.map(item => item.details)

            console.log(errors?.join(""))
        }

        return
    }

    console.log("Built successfully")
})