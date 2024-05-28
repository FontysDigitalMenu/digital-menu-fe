import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect } from 'react'
import SettingsContext from '../../provider/SettingsProvider.jsx'

const NavBarItem = ({ href, icon, text }) => {
    const { t } = useTranslation()
    const setting = useContext(SettingsContext)

    useEffect(() => {}, [setting])

    return (
        <li>
            <Link to={href} className={`flex items-center p-2 rounded-lg text-white group hover:bg-[${setting.secondaryColor}]`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
                <span className="ms-3">{t(text)}</span>
            </Link>
        </li>
    )
}

export default NavBarItem
