import React from "react"
import socket from "../commons/socket"

function createRTCPeerConnection() {
    const pc = new RTCPeerConnection({
        iceServers: [{
            urls: "stun:stun.voipbuster.com:3478",
            username: "test",
            credential: "123456"
        }]
    })

    pc.onicecandidate = evt => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    }
    pc.onconnectionstatechange = evt => {
        console.log(evt, pc.connectionState)
    }
    pc.ontrack = evt => {
        console.log(evt, "ontrack")
    }
    pc.onnegotiationneeded = evt => {
        console.log(evt, "negotiationneeded")
    }

    return pc
}

export default class Main extends React.Component {
    msgContainer = React.createRef()
    videoRef = React.createRef()
    pc = createRTCPeerConnection()
    state = {
        message: "",
        from: "",
        to: ""
    }

    componentDidMount() {
        /* navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false
        }).then(stream => {
            if (this.videoRef.current) {
                this.videoRef.current.srcObject = stream
            }
            stream.getTracks().forEach(track => this.pc.addTrack(track))
        }).catch(e => {
            console.log(e)
        }) */
        this.initSocket()
    }

    handleOnMessage = evt => {
        const data = JSON.parse(evt.data)

        if (data.code !== 0) {
            return
        }

        const message = data.data

        if (message.from) {
            this.addMessageItem(message.from, message.data, "green")
        }
    }


    handleSend = () => {
        const {
            from,
            to,
            message
        } = this.state

        if (message) {
            socket.send(from, to, message)
            this.setState({
                message: ""
            })

            this.addMessageItem("me", message, "red")
        }

    }

    addMessageItem(user, message, color) {
        const container = this.msgContainer.current
        const item = document.createElement("div")

        item.innerHTML = `
            <p style="color: ${color}">${user}:</p>
            <p style="color: ${color}">${message}</p>
        `

        container.append(item)
    }

    handleChange = evt => {
        const name = evt.target.name

        this.setState({
            [name]: evt.target.value
        })
    }

    initSocket = () => {
        socket.init(
            "ws://localhost:8888",
            {
                onmessage: this.handleOnMessage,
                onclose() {
                    console.log("=====closed=====")
                }
            }
        )
    }

    render() {
        const {
            from,
            to,
            message
        } = this.state

        return (
            <>
                <video ref={this.videoRef} autoPlay width={600}/>
                <div ref={this.msgContainer}/>
                <input
                    value={from}
                    name="from"
                    placeholder="from"
                    onChange={this.handleChange}/>
                <input
                    value={to}
                    name="to"
                    placeholder="to"
                    onChange={this.handleChange}/>
                <textarea
                    className="form-control"
                    name="message"
                    value={message}
                    onChange={this.handleChange}/>
                <button className="btn btn-primary" onClick={this.handleSend}>Send</button>
            </>
        )
    }
}
