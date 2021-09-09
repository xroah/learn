import React from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom"
import Main from "./main"
import Login from "./login"

export default () => (
    <Router>
        <Switch>
            <Route exact component={Main} path="/" />
            <Route exact component={Login} path="/login" />
        </Switch>
    </Router>
)