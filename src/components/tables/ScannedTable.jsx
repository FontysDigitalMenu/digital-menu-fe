import { useNavigate, useParams } from 'react-router-dom'
import {useContext, useEffect} from 'react'
import ConfigContext from "../../provider/ConfigProvider.jsx";

function ScannedTable() {
    const { id } = useParams()
    const navigate = useNavigate()
    const config = useContext(ConfigContext)

    useEffect(() => {
        localStorage.setItem('tableId', id)

        if (config) {
            AddHost().then(() => {
                return navigate('/')
            })
        }
    }, [config])

    async function AddHost() {
        const response = await fetch(`${config.API_URL}/api/v1/table/AddHost`, {
            method: 'POST',
            body:  new URLSearchParams({
                id: id,
                deviceId: localStorage.getItem('deviceId'),
            })
        })

        if (response.status === 204) {
            console.log("successfully added host")
        } else {
            console.error("failed set user to host")
        }
    }
}

export default ScannedTable