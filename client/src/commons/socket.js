let username = ''
let ws = null

export default {
    setUsername(name){
        username = name
    },
    initSocket(url, options = {}) {
        this.close()

        ws = new WebSocket(url)
        ws.onmessage = options.onmessage
        ws.onclose = options.onclose
        ws.onopen = options.onopen

        return ws
    },
    send(data) {
        if (!ws || ws.readyState !== ws.OPEN) {
            return
        }

        ws.send(JSON.stringify({
            data,
            username
        }))
    },
    close() {
        if (!ws) {
            return
        }

        ws.close()

        ws = null
    }
}