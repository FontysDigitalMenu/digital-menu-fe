import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../provider/ConfigProvider.jsx'
import waiter from '../../assets/waiter.jpg'
import { Link, useParams } from 'react-router-dom'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import notification from '../../assets/progress-notification.mp3'

function OrderProgress() {
    const config = useContext(ConfigContext)
    const { orderId } = useParams()
    const [order, setOrder] = useState()
    const [loading, setLoading] = useState(true)
    const [waiterPosition, setWaiterPosition] = useState('')
    const [processingClass, setProcessingClass] = useState('')
    const [completedClass, setCompletedClass] = useState('')

    const [connection, setConnection] = useState()

    useEffect(() => {
        if (!config) return

        const newConnection = new HubConnectionBuilder().withUrl(`${config.API_URL}/api/orderHub`, {}).configureLogging(LogLevel.Critical).withAutomaticReconnect().build()
        setConnection(newConnection)
    }, [config])

    useEffect(() => {
        if (!connection) return

        startConnectionAndFetchOrder()

        return () => {
            if (!connection) return

            connection
                .stop()
                .then(() => {
                    console.log('Connection stopped')
                })
                .catch((error) => {
                    console.log('Connection stopped Error: ' + error)
                })
        }
    }, [connection])

    async function startConnectionAndFetchOrder() {
        await connection.start()

        connection.on('ReceiveOrderUpdate', (order) => {
            setOrder(order)
            const audio = new Audio(notification)
            audio.play()
        })

        fetchOrder(orderId).then((r) => r)
    }

    useEffect(() => {
        if (order === undefined || order === null) return

        switch (order.foodStatus) {
            case 'Pending':
                setWaiterPosition('left-0')
                setProcessingClass('w-0')
                setCompletedClass('w-0')
                break
            case 'Processing':
                setWaiterPosition('left-1/2 -translate-x-1/2')
                setProcessingClass('w-2/3')
                setCompletedClass('w-2/3')
                break
            case 'Completed':
                setWaiterPosition('left-full -translate-x-full')
                setProcessingClass('w-2/3')
                setCompletedClass('w-full')
                break
        }
    }, [order])

    async function fetchOrder(orderId) {
        const response = await fetch(`${config.API_URL}/api/v1/Order/${orderId}/${localStorage.getItem('deviceId')}/${localStorage.getItem('tableId')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })

        if (response.status === 200) {
            const data = await response.json()
            setOrder(data)

            const groupName = `order-${data.id}`
            await connection.invoke('AddToOrderGroup', { groupName })
        } else if (response.status === 404) {
            setOrder(null)
        }

        setLoading(false)
    }

    async function handlePaySplit(splitId) {
        const response = await fetch(`${config.API_URL}/api/v1/split/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                splitId: splitId,
            }),
        })

        if (response.status === 200) {
            const data = await response.json()
            window.location.href = data.redirectUrl
        } else if (response.status === 400) {
        } else if (response.status === 404) {
        } else if (response.status === 500) {
        }
    }

    return (
        <div className="relative flex flex-col justify-between min-h-screen">
            {!loading && order && order.isPaymentSuccess === true && (
                <div>
                    <div className="mt-6 w-full flex justify-center">
                        <div className="w-[420px]">
                            <div className="title-box text-6xl font-bold w-full px-2 mb-6">
                                <p className="text-center">Thank you for your order!</p>
                            </div>
                            <div className={`relative h-20`}>
                                <img className={`w-20 absolute ${waiterPosition} duration-1000 transition-all`} src={waiter} alt="waiter" />
                            </div>

                            <div className={'relative text-white'}>
                                <div className="flex absolute w-full z-30">
                                    <div className="rounded-l-lg h-[40px] w-[30%] bg-green-500 flex justify-end items-center pr-3">Received</div>
                                    <div
                                        className="w-0 h-0
                                      border-t-[20px] border-t-transparent
                                      border-b-[20px] border-b-transparent
                                      border-l-[30px] border-l-green-500
                                      "
                                    ></div>
                                </div>

                                <div className="flex absolute w-full z-20">
                                    <div className={`rounded-l-lg h-[40px] ${processingClass} transition-all duration-1000 bg-green-600 flex justify-end items-center pr-3`}>Processing</div>
                                    <div
                                        className="w-0 h-0
                                          border-t-[20px] border-t-transparent
                                          border-b-[20px] border-b-transparent
                                          border-l-[30px] border-l-green-600
                                          "
                                    ></div>
                                </div>

                                <div className="flex absolute w-full z-10">
                                    <div className={`rounded-l-lg h-[40px] ${completedClass} transition-all duration-1000 bg-green-700 flex justify-end items-center rounded pr-3`}>Done</div>
                                </div>
                            </div>

                            <div className="total-box text-2xl font-bold w-full px-2 mt-8 mb-4 pt-4">
                                Total: &nbsp;
                                {new Intl.NumberFormat('nl-NL', {
                                    style: 'currency',
                                    currency: 'EUR',
                                }).format(order ? order.totalAmount / 100 : 0)}
                            </div>
                            <div className="title-box text-2xl font-bold w-full px-2 mt-4 mb-4">
                                <p className="text-left">Order Number: {order.orderNumber}</p>
                            </div>
                            <div className="title-box text-2xl font-bold w-full px-2 mt-4">
                                <p className="text-left">Overview</p>
                            </div>
                            <div className="flex flex-col px-2">
                                {order &&
                                    order.menuItems.map((menuItem) => {
                                        return (
                                            <div key={menuItem.id} className="bg-gray-100 shadow-lg mt-5 rounded-xl">
                                                <div className="product-card w-full h-24 md:h-28 mx-auto flex">
                                                    <div className="image-box h-full flex items-center justify-center">
                                                        <div className="ml-2.5 w-20 bg-white rounded-xl">
                                                            <img className="rounded-xl object-cover aspect-square" src={menuItem.imageUrl} alt="Image product" />
                                                        </div>
                                                    </div>
                                                    <div className="product-box w-6/12 px-2 h-full flex items-center">
                                                        <div className="inner-box size-5/6">
                                                            <p className="name-box first-letter:capitalize h-1/2 font-semibold text-xl">{menuItem.name}</p>
                                                            <p className="price-box h-1/2 flex items-end text-xl">
                                                                {new Intl.NumberFormat('nl-NL', {
                                                                    style: 'currency',
                                                                    currency: 'EUR',
                                                                }).format(menuItem.price / 100)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="amount-box h-full w-32">
                                                        <div className="size-full flex items-center justify-center p-2">
                                                            <div className="overflow-hidden h-8 w-8 rounded-full bg-white flex text-lg">
                                                                <div className="font-bold flex w-full items-center justify-center">{menuItem.quantity}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="px-3 pb-3 flex flex-col">
                                                    {menuItem.excludedIngredients.map((excludedIngredient) => {
                                                        return (
                                                            <div key={excludedIngredient.id} className="flex gap-2 pt-2">
                                                                <span className="material-symbols-outlined text-red-600">close</span>
                                                                <p>{excludedIngredient.name}</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div className="px-3 pb-3 flex justify-between w-full">{menuItem.note && <p className="pt-2">{menuItem.note}</p>}</div>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!loading && order && order.isPaymentSuccess === false && (
                <div>
                    <div className="mt-6 w-full flex justify-center">
                        <div className="w-96 md:w-[500px]">
                            <div className="title-box text-5xl font-bold w-full px-2 mb-6">
                                <p className="text-center">Waiting for all payments to complete</p>
                            </div>
                            <div>
                                {order.splits.map((split) => {
                                    return (
                                        <div key={split.id} className={'flex justify-between'}>
                                            <span>{split.name}</span>
                                            <span>
                                                {new Intl.NumberFormat('nl-NL', {
                                                    style: 'currency',
                                                    currency: 'EUR',
                                                }).format(split.amount / 100)}
                                            </span>

                                            {split.paymentStatus !== 'Paid' ? (
                                                <button onClick={() => handlePaySplit(split.id)} className={'bg-red-600 text-white'}>
                                                    Pay
                                                </button>
                                            ) : (
                                                <span className={'bg-green-600 text-white'}>Paid</span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!loading && order === null && (
                <div className="w-full flex justify-center items-center pt-20">
                    <div>
                        <p className="text-8xl font-bold flex justify-center">404</p>

                        <p className="text-4xl font-bold flex justify-center pt-2">Page not found!</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OrderProgress
