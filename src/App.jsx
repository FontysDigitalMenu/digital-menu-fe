import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/authentication/Login.jsx";
import React, {useEffect, useState} from "react";
import Dashboard from "./components/Dashboard.jsx";
import ScannedTable from "./components/tables/ScannedTable.jsx";
import Tables from "./components/admin/tables/Tables.jsx";
import TablesCreate from "./components/admin/tables/TablesCreate.jsx";
import TablesEdit from "./components/admin/tables/TablesEdit.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [config, setConfig] = useState();

    useEffect(() => {
        async function getConfig() {
            setConfig(await fetch('/config.json').then((res) => res.json()));
        }

        getConfig().then(r => r);
    }, []);

    useEffect(() => {
        if (config) {
            checkAuthentication().then(r => r);
        }
    }, []);

    const checkAuthentication = async () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const response = await fetch(`${config.API_URL}/api/v1/User/info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                console.error('Login failed');
                setIsAuthenticated(false);
                return;
            }

            const data = await response.json();

            if (data.includes('Admin')) {
                setIsAuthenticated(true);
            } else {
                console.error('User does not have permission');
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setIsAuthenticated(false);
        }
    };

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login checkAuthentication={checkAuthentication} />}/>
                    <Route path="/login" element={<Login checkAuthentication={checkAuthentication} /> } />
                    <Route path="/table/:id" element={<ScannedTable />} />

                    {/*ADMIN*/}
                    <Route path={"/admin/tables"} element={<Tables />} />
                    <Route path={"/admin/tables/create"} element={<TablesCreate />} />
                    <Route path={"/admin/tables/:id/edit"} element={<TablesEdit />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
