import "bootstrap/dist/css/bootstrap.min.css"
import "./style.scss"
import React from "react"
import Routes from "./components/routes"
import {render} from "react-dom"

render(
    <Routes />,
    document.getElementById("app")
)