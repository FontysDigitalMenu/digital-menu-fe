import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NavBarItem = ({ href, icon, text }) => {
    const { t } = useTranslation()

    return (
        <li>
            <Link to={href} className="flex items-center p-2 rounded-lg text-white hover:bg-red-600 group">
                <span className="material-symbols-outlined text-2xl">{icon}</span>
                <span className="ms-3">{t(text)}</span>
            </Link>
        </li>
    )
}

export default NavBarItem
