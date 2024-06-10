import { Navbar } from 'flowbite-react'
import { Link } from 'react-router-dom'
import LangSwitcher from '../LangSwitcher.jsx'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../provider/ConfigProvider.jsx'
import SettingsContext from '../../provider/SettingsProvider.jsx'

function Nav() {
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
        <Navbar fluid style={{ backgroundColor: setting.primaryColor, borderBottomColor: 'white', borderBottomWidth: '2px' }} className="px-4">
            <Navbar.Brand as={Link} to="/menu" className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">{setting.companyName}</span>
            </Navbar.Brand>
            <Navbar.Toggle
                style={{
                    color: 'white',
                    backgroundColor: setting.primaryColor,
                    outline: '0px solid',
                    borderColor: 'transparent',
                    boxShadow: 'none',
                }}
            />
            <Navbar.Collapse>
                <div style={{ backgroundColor: setting.primaryColor }} className="font-medium flex flex-col rounded-lg bg-gray-50 md:flex-row">
                    <div className="py-2 pl-3 pr-4 md:p-0 text-white">
                        {t('Current table')}: {tableName}
                    </div>

                    <Navbar.Link as={Link} to="/account/orders" active className={`flex rounded bg-[${setting.primaryColor}] text-white`}>
                        {t('My Orders')}
                    </Navbar.Link>
                    <Navbar.Link as={Link} to="/cart" active className={`flex rounded bg-[${setting.primaryColor}] text-white`}>
                        {t('View Order')}
                    </Navbar.Link>

                    <LangSwitcher className={'py-2 pl-3 pr-4 md:p-0'} />
                </div>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Nav
