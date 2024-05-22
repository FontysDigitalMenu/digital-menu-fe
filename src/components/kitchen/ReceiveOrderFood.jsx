import { useContext, useEffect, useState } from 'react'
import { addToGroup, startConnection, startListen, startListenDrinks, stopListen, stopListenDrinks } from '../../services/OrderHubConnection.jsx'
import ConfigContext from '../../provider/ConfigProvider.jsx'
import notification from '../../assets/notification.mp3'
import toastNotification from '../notifications/ToastNotification.jsx'
import MultipleContainers from '../elements/MultipleContainers.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

function ReceiveOrder() {
    const { t } = useTranslation()
    const config = useContext(ConfigContext)
    const [orders, setOrders] = useState([])

    function handleReceivedOrder(order) {
        const audio = new Audio(notification)
        audio.play()
        toastNotification('success', 'Received order')
        setOrders((prevOrders) => [...prevOrders, order])
    }

    function handleReceiveOrderDrinksUpdate() {
        fetchPaidOrders().then((r) => r)
    }

    useEffect(() => {
        if (!config) return

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
                startListenDrinks(handleReceiveOrderDrinksUpdate)
                await addToGroup('Food')
            } catch (error) {
                console.error('Error starting SignalR connection:', error)
            }
        }
        connect().catch(console.error)
        return () => {
            stopListen()
            stopListenDrinks()
        }
    }, [config])

    async function fetchPaidOrders() {
        const response = await fetch(`${config.API_URL}/api/v1/Order/paid/food`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })

        if (response.status === 200) {
            const data = await response.json()
            setOrders(data)
        } else if (response.status === 404) {
            setOrders(null)
        }
    }

    return (
        <>
            <div className="title text-center text-2xl">
                <FontAwesomeIcon icon={faUtensils} /> {t('Kitchen')}
            </div>
            <MultipleContainers orders={orders} isDrinks={false} />
        </>
    )
}

export default ReceiveOrder
