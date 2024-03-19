import './App.css'
import {BrowserRouter, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/authentication/Login.jsx";
import {useEffect, useState} from "react";
import Dashboard from "./components/Dashboard.jsx";
import AuthService from "./services/AuthService.jsx";
import Tables from "./components/admin/tables/Tables";
import TablesCreate from "./components/admin/tables/TablesEdit";
import TablesEdit from "./components/admin/tables/TablesEdit";
import ScannedTable from "./components/tables/ScannedTable";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        AuthService.checkAuthentication().then(isAuthenticated => setIsAuthenticated(isAuthenticated));

        if (!isAuthenticated){
            AuthService.refreshAccessToken().then(r => r);
        }
    }, []);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/dashboard" element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Login setIsAuthenticated={setIsAuthenticated} />}/>
                    <Route path="/table/:id" element={<ScannedTable />} />

                    {/*AUTH*/}
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} /> } />

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
