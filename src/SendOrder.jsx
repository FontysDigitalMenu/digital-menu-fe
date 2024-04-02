import { useEffect } from "react";
import { startConnection, sendOrder } from "./services/OrderHubConnection";

function SendOrder() {
    useEffect(() => {
        const connect = async () => {
            try {
                await startConnection();
                console.log('SignalR Connected!');
            } catch (error) {
                console.error('Error starting SignalR connection:', error);
            }
        };
        connect().catch(console.error);
    }, []);

    const handleSendOrder = (e) => {
        e.preventDefault();
        sendOrder(1).catch(console.error);
    }

    return (
        <div>
            <p>hello</p>
            <button className="bg-blue-500" onClick={handleSendOrder}>button</button>
        </div>
    );
}

export default SendOrder;
