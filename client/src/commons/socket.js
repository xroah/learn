let ws = null

export default {
    connect(url, options = {}) {
        this.close()

        ws = new WebSocket(url)
        ws.onmessage = options.onmessage
        ws.onclose = options.onclose
        ws.onopen = options.onopen

        return ws
    },
    send(from, to, data) {
        if (!ws || ws.readyState !== ws.OPEN) {
            return
        }

        ws.send(JSON.stringify({
            from,
            to,
            data
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