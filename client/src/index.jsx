import "bootstrap/dist/css/bootstrap.min.css"
import "./style.css"
import React from "react"
import Main from "./components/main"
import {render} from "react-dom"

render(
    <Main/>,
    document.getElementById("app")
)