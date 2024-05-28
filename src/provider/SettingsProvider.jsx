import React, { createContext, useState, useEffect, useContext } from 'react'
import ConfigContext from './ConfigProvider.jsx'

const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
    const config = useContext(ConfigContext)
    const [settings, setSettings] = useState({
        id: 0,
        companyName: '',
        primaryColor: '',
        secondaryColor: '',
    })

    useEffect(() => {
        if (!config) return

        async function fetchSettings() {
            try {
                const response = await fetch(`${config.API_URL}/api/v1/settings`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                    },
                })

                const data = await response.json()
                setSettings(data)
            } catch (error) {
                console.error('Error fetching settings:', error)
            }
        }

        fetchSettings().then((r) => r)
    }, [config])

    return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
}

export default SettingsContext
