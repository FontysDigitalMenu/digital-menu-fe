import { Outlet, useNavigate } from 'react-router-dom'
import SideNav from './navigation/SideNav.jsx'
import { useContext, useEffect } from 'react'
import ConfigContext from '../provider/ConfigProvider.jsx'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import SettingsContext, { SettingsProvider } from '../provider/SettingsProvider.jsx'

function AdminRoot({ setIsAuthenticated }) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const config = useContext(ConfigContext)
    const setting = useContext(SettingsContext)

    useEffect(() => {
        if (!setting) return
        document.title = setting.companyName
    }, [setting])

    useEffect(() => {
        if (!config) return
        if (!setting) return
        fetchUserInfo()
    }, [config, setting])

    async function fetchUserInfo() {
        const response = await fetch(`${config.API_URL}/api/v1/User/info`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        })

        if (response.status === 200) {
            const roles = await response.json()
            if (!roles.includes('Admin')) {
                toast(t('You do not have permission to access this page'), {
                    type: 'error',
                })
                return navigate('/login?intended=admin')
            }
        }
    }

    return (
        <SettingsProvider>
            <SideNav setIsAuthenticated={setIsAuthenticated} />
            <Outlet />
        </SettingsProvider>
    )
}
export default AdminRoot
