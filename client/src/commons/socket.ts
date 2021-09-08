let ws: WebSocket | null = null

interface Options {
    onclose?: ((this: WebSocket, ev: CloseEvent) => any) | null;
    onerror?: ((this: WebSocket, ev: Event) => any) | null;
    onmessage?: ((this: WebSocket, ev: MessageEvent) => any) | null;
    onopen?: ((this: WebSocket, ev: Event) => any) | null;
}

export default {
    connect(url: string, options: Options = {}) {
        this.close()

        ws = new WebSocket(url)
        ws.onmessage = options.onmessage
        ws.onclose = options.onclose
        ws.onopen = options.onopen

        return ws
    },
    send(from: string, to: string, data: any) {
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