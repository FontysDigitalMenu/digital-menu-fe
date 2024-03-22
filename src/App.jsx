import './App.css'
import {BrowserRouter, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/authentication/Login.jsx";
import {useContext, useEffect, useState} from "react";
import Dashboard from "./components/admin/Dashboard.jsx";
import AuthService from "./services/AuthService.jsx";
import Tables from "./components/admin/tables/Tables";
import ScannedTable from "./components/tables/ScannedTable";
import ConfigContext from "./provider/ConfigProvider.jsx";
import TablesCreate from "./components/admin/tables/TablesCreate.jsx";
import TablesEdit from "./components/admin/tables/TablesEdit.jsx";
import {ToastContainer} from "react-toastify";
import CartOverview from "./components/cart/CartOverview.jsx";
import { v4 } from 'uuid';
import Root from "./components/Root.jsx";
import AdminRoot from "./components/AdminRoot.jsx";

function App() {
    const config = useContext(ConfigContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (!config) return;

        if (config.DEVICE_ID !== undefined) {
            localStorage.setItem('deviceId', config.DEVICE_ID);
            return;
        }

        if (!localStorage.getItem('deviceId')) {
            const newDeviceId = v4();
            localStorage.setItem('deviceId', newDeviceId);
        }
    }, [config]);

    useEffect(() => {
        if (config){
            AuthService.checkAuthentication(config).then(isAuthenticated => setIsAuthenticated(isAuthenticated));

            if (!isAuthenticated){
                AuthService.refreshAccessToken(config).then(r => r);
            }
        }
    }, [config]);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Root/>}>
                        <Route path="" element={<Home />}/>
                        <Route path="cart" element={<CartOverview />}/>
                        <Route path="table/:id" element={<ScannedTable />} />
                    </Route>

                    {/*AUTH*/}
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} /> } />

                    {/*ADMIN*/}
                    <Route path={"/admin"} element={isAuthenticated ? <AdminRoot setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/login" />}>
                        <Route path={""} element={<Dashboard setIsAuthenticated={setIsAuthenticated} />}/>
                        <Route path={"tables"} element={<Tables setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path={"tables/create"} element={<TablesCreate setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path={"tables/:id/edit"} element={<TablesEdit setIsAuthenticated={setIsAuthenticated} />} />
                    </Route>
                </Routes>
            </BrowserRouter>

            <ToastContainer />
        </>
    )
}

export default App
