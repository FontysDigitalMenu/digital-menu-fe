import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/authentication/Login.jsx";
import {useEffect, useState} from "react";
import Dashboard from "./components/Dashboard.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthentication().then(r => r);
    }, []);

    const checkAuthentication = async () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const response = await fetch('https://localhost:8000/api/v1/User/info', {
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
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
