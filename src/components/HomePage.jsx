import React, { useContext } from 'react'
import SettingsContext from '../provider/SettingsProvider.jsx'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function HomePage() {
    const { t } = useTranslation()
    const setting = useContext(SettingsContext)

    return (
        <div>
            <h1 className="flex justify-center font-medium text-3xl mt-10 text-center px-2 mb-32">{t('Welcome to the home page')}</h1>

            <div className="w-full flex justify-center px-2">
                <Link to="/reservation" className="rounded-lg w-full py-6 flex justify-center" style={{ backgroundColor: setting.primaryColor }}>
                    <div className="flex gap-2">
                        <p className="text-white text-2xl flex flex-col justify-center">{t('Make a reservation')}</p>
                        <span className="material-symbols-outlined text-white text-5xl">calendar_month</span>
                    </div>
                </Link>
            </div>

            <div className="w-full flex justify-center px-2 my-6">
                <div className="rounded-full bg-black h-16 w-16 flex justify-center items-center">
                    <p className="text-white text-2xl">{t('Or')}</p>
                </div>
            </div>

            <div className="w-full flex justify-center px-2">
                <Link to="/menu" className="rounded-lg w-full py-6 flex justify-center" style={{ backgroundColor: setting.primaryColor }}>
                    <div className="flex gap-2">
                        <p className="text-white text-2xl flex flex-col justify-center">{t('Go to the menu')}</p>
                        <span className="material-symbols-outlined text-white text-5xl">restaurant_menu</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default HomePage
