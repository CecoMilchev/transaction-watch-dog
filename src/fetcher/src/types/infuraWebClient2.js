const options = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_subscribe",
    params: ["newHeads"]
}

export class InfuraWebClient {
    /**
     * @typedef {Object} InfuraWebClient
     * @property {string} url
     * @property {WebSocket} [socket]
     */

    /**
     * @param {string} url - The WebSocket endpoint URL to connect to.
     * @param {BlockProcessor} blockProcessor - An instance of BlockProcessor to handle incoming blocks.
     */
    constructor(url, blockProcessor) {
        this.url = url;
        this.socket = new WebSocket(this.url);
        this.blockProcessor = blockProcessor;
    }

    /**
     * Initializes the WebSocket connection and sets up event listeners.
     * @private
     */
    initializeSocket() {
        console.log("Connecting to Infura WebSocket at:", this.url);
        this.socket = new WebSocket(this.url);

        this.socket.addEventListener("open", this.handleOpen.bind(this));
        this.socket.addEventListener("message", this.handleMessage.bind(this));
        this.socket.addEventListener("close", this.handleClose.bind(this));
        this.socket.addEventListener("error", this.handleError.bind(this));
    }

    /**
     * Initializes the WebSocket connection and sets up event listeners.
     * @private
     */
    handleOpen = () => {
        console.log('WebSocket connection established!');
        // Sends a message to the WebSocket server.
        this.socket?.send(JSON.stringify(options));
    };

    // private handleMessage = (event: MessageEvent) => {
    handleMessage = (event) => {
        // const message: KrakenMessage = JSON.parse(event.data);
        const message = JSON.parse(event.data);
        console.log('Message from server:', message);

        if(message.method === "eth_subscription" && message.params?.result) {
            console.log("New block received:", message.params.result);
            this.blockProcessor.processBlock(message.params?.result);
        }
        // container.router.route(message);
        // this.router?.route(message);
        //console.log('Message from server: ', event.data);
    };

    handleClose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
    };

    handleError = (error) => {
        console.error('WebSocket error:', error);
    };

    connect() {
        console.log("Connecting to Infura WebSocket...");
        // if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        //     return;
        // }

        this.initializeSocket();
    }

    disconnect() {
        console.log("Disconnecting from Infura WebSocket...");

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket?.close();
        }
    }
}
