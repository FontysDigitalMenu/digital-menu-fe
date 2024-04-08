import {useContext, useEffect, useState} from "react";
import {startConnection, startListen, stopListen} from "./services/OrderHubConnection.jsx";
import ConfigContext from "./provider/ConfigProvider.jsx";

function ReceiveOrder() {
    const config = useContext(ConfigContext);
    const [orders, setOrders] = useState([]);

    function handleReceivedOrder(order) {
        console.log(order)
        setOrders(prevOrders => [...prevOrders, order]);
    }

    useEffect(() => {
        if (!config) return;
        async function fetchPaidOrders() {
            const response = await fetch(`${config.API_URL}/api/v1/Order/paid`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('accessToken'),
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setOrders(data);
            } else if (response.status === 404) {
                setOrders(null);
            }
        }
        fetchPaidOrders().then(r => r);
    }, [config]);

    useEffect(() => {
        if (!config) return;

        const connect = async () => {
            try {
                console.log('Trying to connect to hub...');
                await startConnection(config.API_URL);
                console.log('SignalR Connected!');
                startListen(handleReceivedOrder);
            } catch (error) {
                console.error('Error starting SignalR connection:', error);
            }
        };
        connect()
            .catch(console.error);
        return()=>{
            stopListen();
        }
    }, [config]);

    return (
        <>
            <div className="p-4 sm:ml-64">
                <h2>Received Orders</h2>
                {orders  !== null ? (
                    <div>
                        {orders.map((order, index) => (
                            <div key={index} className="mb-4">
                                <p>Order ID: {order.id}</p>
                                <p>Table ID: {order.tableId}</p>
                                <p>Status: {order.status}</p>
                                <p>Total Amount:
                                    {new Intl.NumberFormat('nl-NL', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    }).format(order.totalAmount / 100)}
                                </p>
                                <p>Menu Items:</p>
                                <ul>
                                    {order.menuItems.map((item) => (
                                        <li key={item.id}>
                                            {item.name} -
                                            {new Intl.NumberFormat('nl-NL', {
                                                style: 'currency',
                                                currency: 'EUR'
                                            }).format(item.price / 100)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No orders received yet.</p>
                )}
            </div>

        </>
    );
}

export default ReceiveOrder;
