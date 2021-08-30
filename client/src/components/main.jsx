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

    socket.initSocket(
        "ws://localhost:8888",
        {
            onmessage(evt) {
                console.log("received:", evt.data)
            },
            onclose() {
                console.log("=====closed=====")
            },
            onopen() {
                socket.send("test")
            }
        }
    )

    return pc
}

export default class Main extends React.Component {
    videoRef = React.createRef()
    pc = createRTCPeerConnection()

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
    }

    render() {
        return (
            <>
                <video ref={this.videoRef} autoPlay width={600}></video>
            </>
        )
    }
}
