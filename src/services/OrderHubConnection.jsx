import { HubConnectionBuilder } from '@microsoft/signalr'

let connection

export function startConnection(backendUrl) {
    connection = new HubConnectionBuilder().withUrl(`${backendUrl}/api/orderHub`, {}).withAutomaticReconnect().build()

    return connection.start()
}

export async function addToGroup(groupName) {
    await connection.invoke('AddToGroup', { groupName }).then(() => {
        console.log('added to group', groupName)
    })
}

export function startListen(callback) {
    connection.on('ReceiveOrder', (order) => {
        callback(order)
    })
}

export function stopListen() {
    connection.off('ReceiveOrder')
}

export function startListenDrinks(callback) {
    connection.on('ReceiveOrderDrinksUpdate', (order) => {
        callback(order)
    })
}

export function stopListenDrinks() {
    connection.off('ReceiveOrderDrinksUpdate')
}
