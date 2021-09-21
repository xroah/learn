let ws: WebSocket | null = null

interface Options {
    onclose?: ((this: WebSocket, ev: CloseEvent) => any)
    onerror?: ((this: WebSocket, ev: Event) => any)
    onmessage?: ((this: WebSocket, ev: MessageEvent) => any)
    onopen?: ((this: WebSocket, ev: Event) => any)
    reconnectOnError?: boolean
}

export default {
    connect(url: string, options: Options = {}) {
        this.close()

        ws = new WebSocket(url)
        ws.onmessage = options.onmessage || null
        ws.onclose = options.onclose || null
        ws.onopen = options.onopen || null
        ws.onerror = (ev: Event) => {
            this.close()

            if (options.reconnectOnError) {
                this.connect(url, options)
            }

            if (options.onerror) {
                options.onerror.call(ws!, ev)
            }
        }

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