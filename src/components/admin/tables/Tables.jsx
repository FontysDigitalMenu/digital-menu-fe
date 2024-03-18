import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function Tables() {
    const [config, setConfig] = useState("");
    const [tables, setTables] = useState([]);

    useEffect(() => {
        async function getConfig() {
            setConfig(await fetch('/config.json').then((res) => res.json()));
        }

        getConfig().then(r => r);
    }, []);

    useEffect(() => {
        if (!config) return;
        fetchQrCode().then(r => r);
    }, [config]);

    async function fetchQrCode() {
        const response = await fetch(`${config.API_URL}/api/v1/Table`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('accessToken'),
            },
            credentials: "include",
        });

        const data = await response.json();
        setTables(data);
    }

    return (
        <>
            <Link to={"/admin/tables/create"}>Create new</Link>
            <h1>Tables</h1>
            {
                tables.map((table) => {
                    return (
                        <div key={table.id}>
                            <Link className={"hover:underline"} to={`/admin/tables/${table.id}/edit`}>{table.name}</Link>
                            <img src={`data:image/png;base64,${table.qrCode}`} alt="qr code" width={200}/>
                        </div>
                    )
                })
            }
        </>
    );
}

export default Tables;
