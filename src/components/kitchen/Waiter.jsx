import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../provider/ConfigProvider'
import { startConnection, startListen, stopListen } from '../../services/OrderHubConnection'

function Waiter() {
    const config = useContext(ConfigContext)
    const [orders, setOrders] = useState([])

    function handleReceivedOrder(order) {
        const audio = new Audio(notification)
        audio.play()
        toastNotification('success', 'New completed order')
        setOrders((prevOrders) => [...prevOrders, order])
    }

    useEffect(() => {
        if (!config) return

        async function fetchCompletedOrders() {
            const response = await fetch(`${config.API_URL}/api/v1/order/completed`, {
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

    return (
        <div className="flex justify-center mt-4">
            <div className="w-[93%]">
                <div className="w-[30%] flex border-black border-2 p-2 rounded-xl">
                    <div aria-disabled className="my-auto text-black w-[80%] overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
                        <p className="mb-2 font-bold">Order: {orders.orderNumber}</p>
                        <ul className="list-none p-0">
                            {/* {task.order.menuItems.map((item) => ( */}
                            <li key="{item.id}" className="border border-black rounded mb-2">
                                <div className="flex justify-between items-center">
                                    <span className="flex">
                                        <div className="w-7 border-r-2 border-black flex justify-center">{/*item.quantity*/}2</div>
                                        <div className="pl-2 flex flex-col">
                                            <div>{/* item.name */}Friet</div>
                                            <div>
                                                {/* {item.excludedIngredients.map((excludedIngredient) => {
                        return (
                          <div key={excludedIngredient.id} className="flex gap-2 pt-2">
                            <span className="material-symbols-outlined text-red-600">close</span>
                            <p>{excludedIngredient.name}</p>
                          </div>
                        )
                      })} */}
                                            </div>
                                            <div>{/*item.note && <span>note: {item.note}</span>*/}Note: Geen zout</div>
                                        </div>
                                    </span>
                                </div>
                            </li>
                            {/* ))} */}
                        </ul>
                    </div>
                    <div className="w-[20%] flex justify-center items-center h-auto">
                        <FontAwesomeIcon icon={faCircleCheck} className="w-10 h-10" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Waiter
