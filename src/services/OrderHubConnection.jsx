import { HubConnectionBuilder } from '@microsoft/signalr';

const connection = new HubConnectionBuilder()
    .withUrl(`https://localhost:8000/orderHub`, {})
    .withAutomaticReconnect()
    .build();

export function startConnection() {
    return connection.start();
}

export function sendOrder(order) {
    return connection.invoke('SendOrder', order);
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
