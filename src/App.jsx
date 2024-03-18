import './App.css'
import {BrowserRouter, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/authentication/Login.jsx";
import {useEffect, useState} from "react";
import Dashboard from "./components/Dashboard.jsx";
import AuthService from "./services/AuthService.jsx";

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
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} /> } />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
