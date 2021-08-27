import React from "react"

export default function Main() {
    const ws = new WebSocket("ws://localhost:8888")

    ws.onmessage = evt => {
        const msg = evt.data

        console.log("receive: ", msg)
    }

    return <div>test</div>
}