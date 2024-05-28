import { Outlet } from 'react-router-dom'
import Nav from './navigation/Nav.jsx'
import { SettingsProvider } from '../provider/SettingsProvider.jsx'

function Root() {
    return (
        <SettingsProvider>
            <Nav />
            <Outlet />
        </SettingsProvider>
    )
}
export default Root
