import { Outlet } from 'react-router-dom'
import Nav from './navigation/Nav.jsx'
import SettingsContext, { SettingsProvider } from '../provider/SettingsProvider.jsx'
import { useContext, useEffect } from 'react'
import HomeNav from './navigation/HomeNav.jsx'

function RootHome() {
    const setting = useContext(SettingsContext)

    useEffect(() => {
        if (!setting) return
        document.title = setting.companyName
    }, [setting])

    return (
        <SettingsProvider>
            <HomeNav />
            <Outlet />
        </SettingsProvider>
    )
}
export default RootHome
