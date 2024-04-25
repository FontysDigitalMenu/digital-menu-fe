import { Outlet, useNavigate } from 'react-router-dom'
import StaffNav from './navigation/StaffNav'
import { useContext, useEffect } from 'react'
import ConfigContext from '../provider/ConfigProvider.jsx'
import { toast } from 'react-toastify'

function KitchenRoot({ setIsAuthenticated }) {
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
                toast('You do not have permission to access this page', {
                    type: 'error',
                })
                return navigate('/login?intended=kitchen')
            }
        }
    }

    return (
        <>
            <StaffNav />
            <Outlet />
        </>
    )
}
export default KitchenRoot
