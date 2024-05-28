import React, { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../../provider/ConfigProvider.jsx'
import { useTranslation } from 'react-i18next'
import ToastNotification from '../../notifications/ToastNotification.jsx'
import SettingsContext from '../../../provider/SettingsProvider.jsx'

function Settings() {
    const config = useContext(ConfigContext)
    const setting = useContext(SettingsContext)

    const { t } = useTranslation()
    const [settings, setSettings] = useState({
        id: 0,
        companyName: '',
        primaryColor: '',
        secondaryColor: '',
    })

    useEffect(() => {
        if (!config) return
        fetchSettings().then((r) => r)
    }, [config])

    async function fetchSettings() {
        const response = await fetch(`${config.API_URL}/api/v1/settings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })

        const data = await response.json()
        setSettings(data)
    }

    async function updateSettings() {
        const response = await fetch(`${config.API_URL}/api/v1/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(settings),
        })

        if (response.ok) {
            const updatedSettings = await response.json()
            setSettings(updatedSettings)
            window.location.reload()
            ToastNotification('success', t('Settings updated successfully'))
        } else {
            ToastNotification('error', t('Failed to update settings'))
        }
    }

    const handleColorChange = (event, colorType) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            [colorType]: event.target.value,
        }))
    }

    return (
        <div className="p-4 sm:ml-64">
            <h1 className="text-4xl mb-10 font-bold">{t('Settings')}</h1>

            <div className="max-w-lg mx-auto">
                <div className="mb-5">
                    <p className="block mb-2 text-sm font-medium text-gray-900">{t('Company Name')}</p>
                    <input
                        className={`block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-[${setting.primaryColor}] focus:border-[${setting.primaryColor}]`}
                        type="text"
                        value={settings.companyName}
                        onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    />
                </div>

                <div className="mb-5">
                    <p className="block mb-2 text-sm font-medium text-gray-900">{t('Primary Color')}</p>
                    <input className={`block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-[${setting.primaryColor}] focus:border-[${setting.primaryColor}]`} type="color" value={settings.primaryColor} onChange={(e) => handleColorChange(e, 'primaryColor')} />
                </div>

                <div className="mb-5">
                    <p className="block mb-2 text-sm font-medium text-gray-900">{t('Secondary Color')}</p>
                    <input
                        className={`block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-[${setting.primaryColor}] focus:border-[${setting.primaryColor}]`}
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => handleColorChange(e, 'secondaryColor')}
                    />
                </div>

                <div className="mb-5 flex w-full justify-end">
                    <button className={`bg-[${setting.primaryColor}] hover:bg-[${setting.secondaryColor}] border border-[${setting.primaryColor}] text-white rounded px-4 py-2`} onClick={updateSettings}>
                        {t('Update Settings')}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Settings
