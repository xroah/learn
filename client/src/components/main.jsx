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
        message: ""
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

    }

    handleSend() {
        const {message} = this.state

        if (message) {
            socket.send(message)
            this.setState({
                message: ""
            })
        }

    }

    handleMessageChange = evt => {
        this.setState({
            message: evt.target.value
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
        return (
            <>
                <video ref={this.videoRef} autoPlay width={600}></video>
                <div ref={this.msgContainer}></div>
                <input
                    className="form-control"
                    value={this.state.message}
                    onChange={this.handleMessageChange} />
                <button className="btn btn-primary">Send</button>
            </>
        )
    }
}
