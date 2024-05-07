import {useContext, useEffect, useState} from "react";
import ConfigContext from "../../provider/ConfigProvider.jsx";
import {Link} from "react-router-dom";
import notification from "react-notifications/lib/Notification.js";
import ToastNotification from "../notifications/ToastNotification.jsx";

function WaiterTables() {

    const config = useContext(ConfigContext)
    const [tables, setTables] = useState([])

    useEffect(() => {
        if (!config) return
        fetchQrCode().then((r) => r)
    }, [config])

    async function fetchQrCode() {
        const response = await fetch(`${config.API_URL}/api/v1/Table`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })

        const data = await response.json()
        console.log(data)
        setTables(data)
    }

    function resetSession(tableId){
        fetch(`${config.API_URL}/api/v1/Table/ResetSession/${tableId}`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })
            .then((response) => {
                if (response.status === 204) {
                    ToastNotification('success', 'Reset table successfully');
                }
                else if (response.status === 404) {
                    ToastNotification('error', 'Table not found');
                }
                else{
                    ToastNotification('error', 'Failed to reset table');
                }
            })
            .catch(() => {
                ToastNotification('error', 'Failed to reset table');
            });
    }

    return (
        <div>
            {tables.map((table, index) => (
                <div key={index} className="border border-gray-500 px-2 py-1 rounded w-36 m-1">
                    <div className="flex justify-between ">
                        <div className="mr-4">{table.name}</div>
                        <button onClick={() => resetSession(table.id)} className="flex items-center justify-end">
                            <span className="material-symbols-outlined text-red-500">
                                history
                            </span>
                        </button>
                    </div>
                </div>
            ))}
        </div>

    );
}

export default WaiterTables;