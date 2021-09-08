import React from "react"
import socket from "../commons/socket"

export default class Main extends React.Component {
    msgContainer = React.createRef()
    videoRef = React.createRef()
    pc = null
    state = {
        message: "",
        from: "",
        to: "",
        hasLogin: false
    }

    createRTCPeerConnection() {
        const pc = new RTCPeerConnection({
            iceServers: [{
                urls: "stun:stun.voipbuster.com:3478"
            }]
        })

        pc.onicecandidate = evt => {
            const {from, to} = this.state
            const {candidate} = evt

            if (candidate) {
                socket.send(from, to, {
                    type: "new-ice-candidate",
                    candidate
                })
            }
        }
        pc.onconnectionstatechange = evt => {
            console.log("connectionStateChange", evt)
        }
        pc.ontrack = evt => {
            console.log("onTrack", evt)
            this.videoRef.current.srcObject = evt.streams[0]
        }
        pc.onnegotiationneeded = evt => {
            const {
                from,
                to
            } = this.state

            this.pc.createOffer()
                .then(offer => this.pc.setLocalDescription(offer))
                .then(() => socket.send(from, to, {
                    type: "video-offer",
                    sdp: this.pc.localDescription
                }))
        }

        return pc
    }

    handleVideoOffer(data) {
        const {from} = this.state
        this.pc = this.createRTCPeerConnection()

        this.pc.setRemoteDescription(data.sdp)
            .then(() => this.pc.createAnswer())
            .then(answer => this.pc.setLocalDescription(answer))
            .then(() => socket.send(
                from,
                data.from,
                {
                    type: "video-answer",
                    sdp: this.pc.localDescription
                }
            ))
    }

    handleVideoAnswer(data) {
        this.pc.setRemoteDescription(data.sdp).catch(e => console.log(e))
    }

    handleNewCandidate(data) {
        const newCandidate = new RTCIceCandidate(data.candidate)

        this.pc.addIceCandidate(newCandidate)
            .catch(e => console.log(e))
    }

    handleOnMessage = evt => {
        const received = JSON.parse(evt.data)

        if (received.code !== 0) {
            return
        }

        const data = received.data

        if (data.from) {
            switch (data.type) {
                case "message":
                    this.addMessageItem(data.from, data.message, "green")
                    break
                case "video-offer":
                    this.handleVideoOffer(data)
                    break
                case "video-answer":
                    this.handleVideoAnswer(data)
                    break
                case "new-ice-candidate":
                    this.handleNewCandidate(data)
                    break
            }
        }
    }


    handleSend = () => {
        const {
            from,
            to,
            message
        } = this.state

        if (message) {
            socket.send(from, to, {
                type: "message",
                message
            })
            this.setState({
                message: ""
            })

            this.addMessageItem("me", message, "red")
        }

    }

    handleShare = () => {
        if (this.pc) {
            return
        }

        this.pc = this.createRTCPeerConnection()

        navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false
        }).then(stream => {
            if (this.videoRef.current) {
                this.videoRef.current.srcObject = stream
            }
            console.log(stream)
            stream.getTracks().forEach(track => this.pc.addTrack(track, stream))
        }).catch(e => {
            console.log(e)
        })
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

    connectSocket = () => {
        socket.connect(
            `wss://${location.host}/websocket/${this.state.from}`,
            {
                onmessage: this.handleOnMessage,
                onclose() {
                    console.log("=====closed=====")
                }
            }
        )
    }

    handleLogin = () => {
        const {from} = this.state

        if (!from) {
            return
        }

        this.setState({
            hasLogin: true
        })

        this.connectSocket()
    }

    render() {
        const {
            from,
            to,
            message
        } = this.state

        return (
            <>
                <video ref={this.videoRef} controls autoPlay width={600}/>
            </>
        )
    }
}
