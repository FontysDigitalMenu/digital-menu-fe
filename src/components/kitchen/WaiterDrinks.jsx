import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../provider/ConfigProvider'
import { startConnection, startListen, startListenDrinks, stopListen } from '../../services/OrderHubConnection'
import ToastNotification from '../notifications/ToastNotification'
import { useTranslation } from 'react-i18next'

function Waiter() {
    const { t } = useTranslation()
    const config = useContext(ConfigContext)
    const [orders, setOrders] = useState([])

    function handleReceiveOrderDrinksUpdate() {
        fetchCompletedOrders().then((r) => r)
    }

    useEffect(() => {
        if (!config) return

        fetchCompletedOrders().then((r) => r)
    }, [config])

    useEffect(() => {
        if (!config) return

        const connect = async () => {
            try {
                console.log('Trying to connect to hub...')
                await startConnection(config.API_URL)
                console.log('SignalR Connected!')
                startListen(handleReceiveOrderDrinksUpdate)
                startListenDrinks(handleReceiveOrderDrinksUpdate)
            } catch (error) {
                console.error('Error starting SignalR connection:', error)
            }
        }
        connect().catch(console.error)
        return () => {
            stopListen()
        }
    }, [config])

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
            ToastNotification('success', t('Order removed'))
        }
    }

    if (orders.length <= 0) {
        return <div className="title text-center text-2xl">{t('No orders ready for serving')}</div>
    } else {
        return (
            <div className="flex justify-center mt-4">
                <div className="w-[93%]">
                    {orders.map((item) => (
                        <div key={item.id} className="w-[30%] mb-3 border-black border-2 rounded-xl overflow-hidden">
                            <div className="bg-gray-300 w-full h-12 p-2">
                                <div className="mb-2 flex justify-between w-full">
                                    <div className="font-bold">
                                        {t('Order')}: <span className={'font-mono'}>{item.orderNumber}</span>
                                    </div>
                                    <div className="text-right">{item.table.name}</div>
                                </div>
                            </div>
                            <div className="w-full h-auto flex p-2">
                                <div aria-disabled className="my-auto text-black w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap rounded-t-xl">
                                    <div className="w-full">
                                        <ul className="list-none p-0">
                                            {item.menuItems.map((item) => (
                                                <li key={item.id} className="border-b-2 border-gray-200 mb-2 w-full">
                                                    <div className="flex justify-between items-center py-3 w-full">
                                                        <span className="w-full">
                                                            <div className="w-full flex justify-between">
                                                                <div className="font-bold">
                                                                    <p>{item.name}</p>
                                                                </div>
                                                                <div className="w-32 text-right">
                                                                    <p className="font-bold">
                                                                        {t('AmountQuantity')}: {item.quantity}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="w-full">
                                                                {item.excludedIngredients.length > 0 && (
                                                                    <div className="mt-4">
                                                                        {item.excludedIngredients.map((excludedIngredient) => (
                                                                            <div key={excludedIngredient.id} className="flex gap-2 pt-2">
                                                                                <span className="material-symbols-outlined text-red-600">close</span>
                                                                                <p>{excludedIngredient.name}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {item.note ? (
                                                                    <div className={`${item.note ? 'mt-4' : ''} mb-4`}>
                                                                        <span>note: {item.note}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="mt-4"></div>
                                                                )}
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <hr></hr>
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
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Waiter
