import { HubConnectionBuilder } from '@microsoft/signalr'

let connection

export function startConnection(backendUrl) {
    connection = new HubConnectionBuilder().withUrl(`${backendUrl}/api/orderHub`, {}).withAutomaticReconnect().build()

    return connection.start()
}

export function startListen(callback) {
    connection.on('ReceiveOrder', (order) => {
        console.log('Received order:', order)
        callback(order)
    })
}

export async function addToGroup(groupName){
    await connection.invoke('AddToGroup', { groupName }).then(() => {
        console.log("added to group", groupName)
    })
}

export function stopListen() {
    connection.off('ReceiveOrder')
}
