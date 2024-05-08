import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import ConfigContext from '../../provider/ConfigProvider.jsx'

function ScannedTable() {
    const { id } = useParams()
    const navigate = useNavigate()
    const config = useContext(ConfigContext)

    useEffect(() => {
        if (config) {
            configureLocalstorageItems().then(() => {
                return navigate('/')
            })
        }
    }, [config])

    async function configureLocalstorageItems() {
        await AddHost()
        await AddTableSessionId()
    }

    async function AddTableSessionId() {
        const response = await fetch(`${config.API_URL}/api/v1/table/${id}`)

        if (response.status === 200) {
            const data = await response.json()
            localStorage.setItem('tableSessionId', data.sessionId)
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
    }
}

export default ScannedTable
