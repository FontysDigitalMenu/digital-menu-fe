import './App.css'
import {BrowserRouter, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/authentication/Login.jsx";
import {useContext, useEffect, useState} from "react";
import Dashboard from "./components/Dashboard.jsx";
import AuthService from "./services/AuthService.jsx";
import ConfigContext from "./provider/ConfigProvider.jsx";

function App() {
    const config = useContext(ConfigContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        AuthService.checkAuthentication(config).then(isAuthenticated => setIsAuthenticated(isAuthenticated));

        if (!isAuthenticated){
            AuthService.refreshAccessToken(config).then(r => r);
        }
    }, [config]);

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
