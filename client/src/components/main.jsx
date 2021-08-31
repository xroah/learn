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
                urls: "stun:stun.stunprotocol.org"
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

            console.log("onCandidate:", evt)
        }
        pc.onconnectionstatechange = evt => {

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

            console.log("onNegotiationNeed:", evt)
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

    handleVideoAnwser(data) {
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
                case "video-anwser":
                    this.handleVideoAnwser(data)
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
            stream.getTracks().forEach(track => this.pc.addTrack(track))
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

    initSocket = () => {
        socket.init(
            `ws://localhost:8888/${this.state.from}`,
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

        this.initSocket()
    }

    render() {
        const {
            from,
            to,
            message,
            hasLogin
        } = this.state

        if (!hasLogin) {
            return (
                <>
                    <input
                        value={from}
                        name="from"
                        placeholder="username"
                        className="form-control"
                        onChange={this.handleChange}/>
                    <button className="btn btn-secondary" onClick={this.handleLogin}>Login</button>
                </>
            )
        }

        return (
            <>
                <video ref={this.videoRef} autoPlay width={600}/>
                <div ref={this.msgContainer}/>
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
                <button className="btn btn-secondary" onClick={this.handleShare}>Share screen</button>
            </>
        )
    }
}
