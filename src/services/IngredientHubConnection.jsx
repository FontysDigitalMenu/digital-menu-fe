import { HubConnectionBuilder } from '@microsoft/signalr'

let connection
export function startConnectionForIngredients(backendUrl) {
    connection = new HubConnectionBuilder().withUrl(`${backendUrl}/api/ingredientHub`, {}).withAutomaticReconnect().build()

    return connection.start()
}

export function startListenForIngredients(callback) {
    connection.on('ReceiveIngredient', (ingredients) => {
        console.log('Received ingredients:', ingredients)
        callback(ingredients)
    })
}

export function stopListenForIngredients() {
    connection.off('ReceiveIngredient')
}
