import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack"
import common from "./common";

const baseConf = common()

baseConf.plugins!.push(new MiniCssExtractPlugin)

webpack(baseConf, () => {
    console.log("built successfully")
})