export const initWebSocket = (url: string): WebSocket => {
    const webSocket = new WebSocket(url);

    webSocket.onopen = () => {
        console.log(`WebSocket connected to: ${url}`);
    };

    webSocket.onclose = () => {
        console.log(`WebSocket disconnected from: ${url}`);
    };

    return webSocket;
};