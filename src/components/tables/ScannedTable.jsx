import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../provider/ConfigProvider.jsx'

function ScannedTable() {
    const { id } = useParams()
    const navigate = useNavigate()
    const config = useContext(ConfigContext)
    const [step, setStep] = useState('firstTableScan')
    const [trigger, setTrigger] = useState(1)

    useEffect(() => {
        if (config) {
            run().then((r) => r)
        }
    }, [config, step, trigger])

    async function run() {
        switch (step) {
            case 'firstTableScan':
                await AddTableSessionId()
                break
            case 'secondTableScanWithCode':
                // eslint-disable-next-line no-case-declarations
                const code = prompt('Please enter the 6 digit code from your reservation mail')
                await AddTableSessionIdWithCode(code)
                break
            case 'done':
                return navigate('/')
        }
    }

    async function AddTableSessionId() {
        const response = await fetch(`${config.API_URL}/api/v1/table/scan/${id}`)

        if (response.status === 200) {
            const data = await response.json()
            localStorage.setItem('tableSessionId', data.sessionId)

            setStep('done')
            setTrigger((prev) => prev + 1)
        } else if (response.status === 401) {
            setStep('secondTableScanWithCode')
            setTrigger((prev) => prev + 1)
        }
    }

    async function AddTableSessionIdWithCode(code) {
        const response = await fetch(`${config.API_URL}/api/v1/table/scan/${id}/${code}`)

        if (response.status === 200) {
            const data = await response.json()
            localStorage.setItem('tableSessionId', data.sessionId)

            setStep('done')
            setTrigger((prev) => prev + 1)
        } else if (response.status === 401) {
            setStep('secondTableScanWithCode')
            setTrigger((prev) => prev + 1)
        }
    }

    // async function AddHost() {
    //     const response = await fetch(`${config.API_URL}/api/v1/table/AddHost`, {
    //         method: 'POST',
    //         body: new URLSearchParams({
    //             id: id,
    //             deviceId: localStorage.getItem('deviceId'),
    //         }),
    //     })
    //
    //     if (response.status === 204) {
    //         console.log('successfully added host')
    //     } else {
    //         console.error('failed set user to host')
    //     }
    // }
}

export default ScannedTable
