import webpack, {HotModuleReplacementPlugin} from "webpack"
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import common from "./common"
import WebpackDevServer, {Configuration} from "webpack-dev-server"

function startServer() {
    const baseConf = common(true)
    const devServer: Configuration = {
        port: 8000,
        https: true,
        host: "0.0.0.0",
        hot: true,
        historyApiFallback: true,
        proxy: {
            "/websocket": {
                target: "ws://localhost:5678",
                ws: true
            }
        }
    }

    baseConf.plugins!.push(
       new HotModuleReplacementPlugin(),
       new ReactRefreshPlugin() 
    )

    const server = new WebpackDevServer(devServer, webpack(baseConf) as any)

    server.start()
    
}

export default (env: any) => {
   const baseConf = common(env.dev)
   const devServer: Configuration = {
       port: 8000,
       https: true,
       host: "0.0.0.0",
       hot: true,
       historyApiFallback: true,
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

   baseConf.plugins!.push(
       new HotModuleReplacementPlugin(),
       new ReactRefreshPlugin()
   )

   return {
       ...baseConf,
       devServer,
       devtool: "eval-source-map",
   }
}

startServer()