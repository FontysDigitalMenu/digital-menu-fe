import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../provider/ConfigProvider'
import { startConnection, startListen, stopListen } from '../../services/OrderHubConnection'
import ToastNotification from '../notifications/ToastNotification'

function Waiter() {
    const config = useContext(ConfigContext)
    const [orders, setOrders] = useState([])

    function handleReceivedOrder(order) {
        const audio = new Audio(notification)
        audio.play()
        toastNotification('success', 'New completed order')
        setOrders((prevOrders) => [...prevOrders, order])
    }

    async function updateOrderStatus(orderId) {
        const response = await fetch(`${config.API_URL}/api/v1/Order/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
            body: JSON.stringify({
                orderStatus: 'Done',
                isDrinks: true,
            }),
        })

        if (response.status === 204) {
            console.log('Updated')
            setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId))
            ToastNotification('success', 'Order removed')
        }
    }

    useEffect(() => {
        if (!config) return

        async function fetchCompletedOrders() {
            const response = await fetch(`${config.API_URL}/api/v1/order/completed/drinks`, {
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

        fetchCompletedOrders().then((r) => r)
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

    if(orders.length <= 0) {
        return (
            <div className='h-full w-full flex justify-center items-center'>
                <div className=''>
                    No Orders
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="flex justify-center mt-4">
                <div className="w-[93%]">
                    {orders.map((item) => (
                        <div key={item.id} className="w-[30%] mb-3 flex border-black border-2 p-2 rounded-xl">
                            <div aria-disabled className="my-auto text-black w-[80%] overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
                                <div>
                                    <p className="mb-2 font-bold">Order: {item.orderNumber}</p>
                                    <ul className="list-none p-0">
                                        {item.menuItems.map((menuItem) => (
                                            <li key={menuItem.id} className="border border-black rounded mb-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="flex">
                                                        <div className="flex">
                                                            <div className="w-7 border-r-2 border-black flex justify-center">{menuItem.quantity}</div>
                                                            <div className="pl-2 flex flex-col">
                                                                <div>{menuItem.name}</div>
                                                                <div>
                                                                    {menuItem.excludedIngredients.map((excludedIngredient) => (
                                                                        <div key={excludedIngredient.id} className="flex gap-2 pt-2">
                                                                            <span className="material-symbols-outlined text-red-600">close</span>
                                                                            <p>{excludedIngredient.name}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div>{menuItem.note && <span>note: {menuItem.note}</span>}</div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="w-[20%] flex justify-center items-center h-auto">
                                <button onClick={() => updateOrderStatus(item.id)}>
                                    <FontAwesomeIcon icon={faCircleCheck} className="w-10 h-10" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Waiter
