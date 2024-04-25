import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import ConfigContext from '../../provider/ConfigProvider.jsx'
import { toast } from 'react-toastify'
import toastNotification from '../notifications/ToastNotification.jsx'

function ScannedTable() {
    const { id } = useParams()
    const navigate = useNavigate()
    const config = useContext(ConfigContext)

    useEffect(() => {
        if (config) {
            setTableSessionId().then((r) => r)
        }
    }, [config])

    async function setTableSessionId() {
        const response = await fetch(`${config.API_URL}/api/v1/table/${id}`)

        if (response.status === 200) {
            const data = await response.json()
            localStorage.setItem('tableSessionId', data.sessionId)
            await AddHost()
        } else {
            toastNotification('error', 'Failed to connect to table')
        }
    }

    async function AddHost() {
        const response = await fetch(`${config.API_URL}/api/v1/table/AddHost`, {
            method: 'POST',
            body: new URLSearchParams({
                id: id,
                deviceId: localStorage.getItem('deviceId'),
            }),
        })

        if (response.status === 204) {
            console.log('successfully added host')
        } else {
            console.error('failed set user to host')
        }
        return navigate('/')
    }
}

export default ScannedTable
