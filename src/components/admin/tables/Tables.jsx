import {useContext, useEffect, useState} from "react";
import Spinner from "../../elements/Spinner.jsx";
import TableQrCode from "./TableQrCode.jsx";
import SideNav from "../../navigation/SideNav.jsx";
import ToastNotification from "../../notifications/ToastNotification.jsx";
import ButtonCreateNew from "../../elements/ButtonCreateNew.jsx";
import ConfigContext from "../../../provider/ConfigProvider.jsx";
import AuthService from "../../../services/AuthService.jsx";

function Tables({setIsAuthenticated}) {
    const config = useContext(ConfigContext);
    const [tables, setTables] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
            ToastNotification('success', 'Deleted successfully');
        } else if (response.status === 401) {
            await AuthService.refreshAccessToken();
            await submitDelete(id);
        }
    }

    return (
        <>
            <SideNav setIsAuthenticated={setIsAuthenticated}/>

            <div className="p-4 sm:ml-64">
                <ButtonCreateNew text={"Create new"} navigateUrl={"/admin/tables/create"} />
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
                                    <TableQrCode table={table} config={config} handleDelete={submitDelete}/>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Tables;
