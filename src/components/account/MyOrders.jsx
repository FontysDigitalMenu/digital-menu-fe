import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../provider/ConfigProvider.jsx'
import Order from './Order.jsx'

function MyOrders() {
    const config = useContext(ConfigContext)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        if (config) {
            fetchOrders().then((r) => r)
        }
    }, [config])

    async function fetchOrders() {
        const response = await fetch(`${config.API_URL}/api/v1/order/${localStorage.getItem('tableId')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.status === 200) {
            const data = await response.json()
            setOrders(data)
        } else {
            console.error("Couldn't retrieve the menu item")
        }
    }

    return (
        <div className="relative flex flex-col justify-between min-h-screen">
            <div className="min-h-screen flex flex-col bg-gray-50 px-5">
                <h1 className={'text-3xl mt-4'}>Order history</h1>
                <div className={'flex flex-col gap-y-8'}>{orders && orders.map((order) => <Order key={order.id} order={order} />)}</div>
            </div>
        </div>
    )
}

export default MyOrders
