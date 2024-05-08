import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import ConfigContext from '../../provider/ConfigProvider.jsx'
import ToastNotification from '../notifications/ToastNotification.jsx'
import { Link } from 'react-router-dom'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

function CartOverview() {
    const config = useContext(ConfigContext)
    const [cartItemCollection, setCartItemCollection] = useState()
    const [connection, setConnection] = useState()

    useEffect(() => {
        if (!config) return
        fetchCartItems().then((r) => r)

        const newConnection = new HubConnectionBuilder().withUrl(`${config.API_URL}/api/orderHub`, {}).configureLogging(LogLevel.Critical).withAutomaticReconnect().build()
        setConnection(newConnection)
    }, [config])

    useEffect(() => {
        if (!connection) return

        startConnection()

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

    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    async function startConnection() {
        await connection.start()

        const groupName = `cart-${localStorage.getItem('tableSessionId')}`
        await connection.invoke('AddToGroup', { groupName })

        connection.on('ReceiveCartUpdate', (cartItemCollection) => {
            setCartItemCollection(cartItemCollection)
        })
    }

    async function fetchCartItems() {
        const response = await fetch(`${config.API_URL}/api/v1/CartItem/${localStorage.getItem('tableSessionId')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })

        if (response.status === 200) {
            const data = await response.json()
            setCartItemCollection(data)
        } else if (response.status === 404) {
            setCartItemCollection(null)
        }
    }

    async function handlePlus(id) {
        const response = await fetch(`${config.API_URL}/api/v1/CartItem/plus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                cartItemId: id,
                tableSessionId: localStorage.getItem('tableSessionId'),
            }),
        })

        if (response.status === 204) {
            await fetchCartItems()
        } else {
            ToastNotification('error', 'Error while adding item to order')
        }
    }

    async function handleMinus(id) {
        const response = await fetch(`${config.API_URL}/api/v1/CartItem/minus`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                cartItemId: id,
                tableSessionId: localStorage.getItem('tableSessionId'),
            }),
        })

        if (response.status === 204) {
            await fetchCartItems()
        } else {
            ToastNotification('error', 'Error while removing item from order')
        }
    }

    return (
        <div className="relative flex flex-col justify-between min-h-screen">
            <div>
                <div className="mt-6 w-full flex justify-center">
                    <div className="w-96 md:w-[500px]">
                        <div className="title-box text-2xl font-bold w-full px-2">
                            <p className="text-left">Your Order</p>
                        </div>
                        <div className="min-h-screen flex flex-col px-2">
                            {!cartItemCollection && <p className="text-center">No items in your order</p>}
                            {cartItemCollection &&
                                cartItemCollection.cartItems.map((cartItem) => {
                                    return (
                                        <div key={cartItem.id} className="bg-gray-100 shadow-lg mt-5 rounded-xl">
                                            <div className="product-card w-full h-24 md:h-28 mx-auto flex">
                                                <div className="image-box h-full flex items-center justify-center">
                                                    <div className="ml-2.5 w-20 bg-white rounded-xl">
                                                        <img className="rounded-xl object-cover aspect-square" src={cartItem.menuItem.imageUrl} alt="Image product" />
                                                    </div>
                                                </div>
                                                <div className="product-box w-6/12 px-2 h-full flex items-center">
                                                    <div className="inner-box size-5/6">
                                                        <p className="name-box first-letter:capitalize h-1/2 font-semibold text-xl">{cartItem.menuItem.name}</p>
                                                        <p className="price-box h-1/2 flex items-end text-xl">
                                                            {new Intl.NumberFormat('nl-NL', {
                                                                style: 'currency',
                                                                currency: 'EUR',
                                                            }).format(cartItem.menuItem.price / 100)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="amount-box h-full w-32">
                                                    <div className="size-full flex items-center justify-center p-2">
                                                        <div className="count-box rounded-md overflow-hidden bg-white h-8 w-full flex text-lg">
                                                            <button onClick={() => handleMinus(cartItem.id)} className="w-1/3 h-full bg-gray-300 font-bold flex items-center justify-center">
                                                                -
                                                            </button>
                                                            <div className="w-1/3 font-bold flex items-center justify-center">{cartItem.quantity}</div>
                                                            <button onClick={() => handlePlus(cartItem.id)} className="w-1/3 h-full bg-gray-300 font-bold flex items-center justify-center">
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-3 pb-3 pt-4 flex justify-between w-full">
                                                {cartItem.note && <p>{cartItem.note}</p>}
                                                <Link to={`/cartItem/edit/${cartItem.id}`} className="w-full">
                                                    <p className="text-blue-500 flex justify-end">View details</p>
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>

                        <div className="bottom-box w-full pt-3 sticky bottom-0 left-0" style={{ backgroundColor: 'rgb(255,255,255,.8)' }}>
                            <div className="total-box h-1/2 flex items-center justify-center text-2xl font-bold">
                                Your Total: &nbsp;
                                {new Intl.NumberFormat('nl-NL', {
                                    style: 'currency',
                                    currency: 'EUR',
                                }).format(cartItemCollection ? cartItemCollection.totalAmount / 100 : 0)}
                            </div>
                            <div className="text-2xl w-full h-1/2 flex items-center justify-center">
                                <Link to={'/order/split'} className="flex items-center py-2 h-full text-white rounded-2xl italic mb-3 justify-center w-9/12 bg-red-500 hover:bg-red-600">
                                    Split Order Bill
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartOverview
