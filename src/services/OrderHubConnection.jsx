import { HubConnectionBuilder } from '@microsoft/signalr';

let connection;

export function startConnection(backendUrl) {
    connection = new HubConnectionBuilder()
        .withUrl(`${backendUrl}/orderHub`, {})
        .withAutomaticReconnect()
        .build();

    return connection.start();
}

export function startListen(callback) {
    connection.on("ReceiveOrder", (order) => {
        console.log("Received order:", order);
        callback(order);
    });
}

export function stopListen() {
    connection.off("ReceiveOrder");
}
