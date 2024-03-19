import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Spinner from "../../Spinner.jsx";
import TableQrCode from "./TableQrCode.jsx";

function Tables() {
    const [config, setConfig] = useState("");
    const [tables, setTables] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        const response = await fetch(`${config.API_URL}/api/v1/Table`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('accessToken'),
            },
        });
        setIsLoading(false);

        const data = await response.json();
        setTables(data);
    }

    async function submitDelete(id) {
        if (confirm("Are you sure you want to delete this table?") === false) return;

        const response = await fetch(`${config.API_URL}/api/v1/Table/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('accessToken'),
            },
        });

        if (response.status === 204) {
            fetchQrCode().then(r => r);
        } else if (response.status === 401) {
            // await auth.refresh();
            // submitDelete(id);
        }
    }

    return (
        <>
            <Link to={"/admin/tables/create"}>Create new</Link>
            <h1>Tables</h1>
            {isLoading && <Spinner/>}
            <table>
                <thead>
                <tr>
                    <th>name</th>
                    <th>qrcode</th>
                    <th>actions</th>
                </tr>
                </thead>
                <tbody>
                {
                    tables.map((table) => {
                        return (
                            <tr key={table.id}>
                                <TableQrCode table={table} config={config} handleDelete={submitDelete} />
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </>
    );
}

export default Tables;
