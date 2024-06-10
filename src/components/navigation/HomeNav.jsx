import { Navbar } from 'flowbite-react'
import { Link } from 'react-router-dom'
import LangSwitcher from '../LangSwitcher.jsx'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../provider/ConfigProvider.jsx'
import SettingsContext from '../../provider/SettingsProvider.jsx'

function HomeNav() {
    const { t } = useTranslation()
    const config = useContext(ConfigContext)
    const setting = useContext(SettingsContext)
    const [tableName, setTableName] = useState('')

    useEffect(() => {
        if (!config) return
        fetchCurrentTable().then((r) => r)
    }, [config])

    async function fetchCurrentTable() {
        const response = await fetch(`${config.API_URL}/api/v1/Table/sessionId/${localStorage.getItem('tableSessionId')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })

        const data = await response.json()
        if (response.status === 200) {
            setTableName(data.name)
        }
    }

    return (
        <Navbar fluid style={{ backgroundColor: setting.primaryColor, borderBottomColor: 'white', borderBottomWidth: '2px' }} className="px-4 flex justify-center">
            <Navbar.Brand as={Link} to="/menu" className="flex items-center space-x-3 py-1 rtl:space-x-reverse">
                <span className="w-full flex justify-center text-2xl font-semibold text-white">{setting.companyName}</span>
            </Navbar.Brand>
        </Navbar>
    )
}

export default HomeNav
