import {useEffect, useState} from "react";

function TablesPage() {
    const [config, setConfig] = useState("");
    const [tables, setTables] = useState([]);

    useEffect(() => {
        async function getConfig() {
            setConfig(await fetch('/config.json').then((res) => res.json()));
        }

        getConfig();
    }, []);

    useEffect(() => {
        if (!config) return;
        fetchQrCode();
    }, [config]);

    async function fetchQrCode() {
        const response = await fetch(`${config.API_URL}/api/v1/Table`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                // "Authorization": "Bearer " + accessToken,
            },
            credentials: "include",
        });

        const data = await response.json();
        setTables(data);
    }

    return (
        <>
            {
                tables.map((table) => {
                    return (
                        <div key={table.id}>
                            <p>{table.name}</p>
                            <img src={`data:image/png;base64,${table.qrCode}`} alt="qr code" width={200}/>
                        </div>
                    )
                })
            }
        </>
    );
}

export default TablesPage;