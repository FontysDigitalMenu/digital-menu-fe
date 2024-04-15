import { useContext, useEffect, useState } from 'react'
import { startConnection, startListen, stopListen } from './services/OrderHubConnection.jsx'
import ConfigContext from './provider/ConfigProvider.jsx'
import notification from './assets/notification.mp3'
import toastNotification from './components/notifications/ToastNotification.jsx'
import MultipleContainers from './components/elements/MultipleContainers.jsx'
function ReceiveOrder() {
    const config = useContext(ConfigContext)
    const [orders, setOrders] = useState([])

    function handleReceivedOrder(order) {
        console.log(order)
        const audio = new Audio(notification)
        audio.play()
        toastNotification('success', 'Received order')
        setOrders((prevOrders) => [...prevOrders, order])
    }

    useEffect(() => {
        if (!config) return
        async function fetchPaidOrders() {
            const response = await fetch(`${config.API_URL}/api/v1/Order/paid`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                },
            })

            if (response.status === 200) {
                const data = await response.json()
                console.log(data)
                setOrders(data)
            } else if (response.status === 404) {
                setOrders(null)
            }
        }
        fetchPaidOrders().then((r) => r)
    }, [config])

    useEffect(() => {
        if (!config) return

        const connect = async () => {
            try {
                console.log('Trying to connect to hub...')
                await startConnection(config.API_URL)
                console.log('SignalR Connected!')
                startListen(handleReceivedOrder)
            } catch (error) {
                console.error('Error starting SignalR connection:', error)
            }
        }
        connect().catch(console.error)
        return () => {
            stopListen()
        }
    }, [config])

    return (
        <>
            <MultipleContainers orders={orders} />
        </>
    )
}

export default ReceiveOrder
