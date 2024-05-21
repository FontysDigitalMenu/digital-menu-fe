import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ConfigProvider } from './provider/ConfigProvider.jsx'
import './i18n.js'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <React.Suspense fallback="loading">
            <ConfigProvider>
                <App />
            </ConfigProvider>
        </React.Suspense>
    </React.StrictMode>
)
