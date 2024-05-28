import { Outlet, useNavigate } from 'react-router-dom'
import StaffNav from './navigation/StaffNav'
import { useContext, useEffect } from 'react'
import ConfigContext from '../provider/ConfigProvider.jsx'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { SettingsProvider } from '../provider/SettingsProvider.jsx'

function KitchenRoot({ setIsAuthenticated }) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const config = useContext(ConfigContext)

    useEffect(() => {
        if (!config) return
        fetchUserInfo()
    }, [config])

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
            if (!(roles.includes('Employee') || roles.includes('Admin'))) {
                toast(t('You do not have permission to access this page'), {
                    type: 'error',
                })
                return navigate('/login?intended=kitchen')
            }
        }
    }

    return (
        <SettingsProvider>
            <StaffNav />
            <Outlet />
        </SettingsProvider>
    )
}
export default KitchenRoot
