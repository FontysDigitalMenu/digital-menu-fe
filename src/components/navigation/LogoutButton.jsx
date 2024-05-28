import { useTranslation } from 'react-i18next'
import SettingsContext from '../../provider/SettingsProvider.jsx'
import { useContext } from 'react'

function LogoutButton({ onClick }) {
    const setting = useContext(SettingsContext)
    const { t } = useTranslation()

    return (
        <li>
            <button onClick={onClick} className="w-full">
                <div className={`flex justify-start rounded-lg text-white hover:bg-[${setting.secondaryColor}] group`}>
                    <div className="flex items-center p-2">
                        <span className="material-symbols-outlined text-2xl">logout</span>
                        <span className="flex-1 ms-3 whitespace-nowrap">{t('Sign out')}</span>
                    </div>
                </div>
            </button>
        </li>
    )
}

export default LogoutButton
