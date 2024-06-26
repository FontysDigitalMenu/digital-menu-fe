import { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoutButton from './LogoutButton.jsx'
import NavBarItem from './NavBarItem.jsx'
import SettingsContext from '../../provider/SettingsProvider.jsx'
import ConfigContext from '../../provider/ConfigProvider.jsx'

function SideNav({ setIsAuthenticated }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const navigate = useNavigate()
    const sidebarRef = useRef(null)

    const config = useContext(ConfigContext)
    const setting = useContext(SettingsContext)

    useEffect(() => {
        if (!config) return
    }, [config, setting])

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false)
    }

    const logout = () => {
        localStorage.clear()
        setIsAuthenticated(false)
        navigate('/login')
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    if (!setting) {
        return null
    }

    return (
        <div>
            <button onClick={toggleSidebar} aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="default-sidebar" ref={sidebarRef} className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? '' : '-translate-x-full'} sm:translate-x-0`} aria-label="Sidebar">
                <div className={`h-full flex flex-col justify-between px-3 py-4 overflow-y-auto bg-[${setting.primaryColor}]`}>
                    <ul className="space-y-2 font-medium text-lg" onClick={closeSidebar}>
                        <NavBarItem href={'/menu'} icon={'home'} text={'Home'} />
                        <NavBarItem href={'/admin/tables'} icon={'table_restaurant'} text={'Tables'} />

                        <NavBarItem href={'/admin/menuItems?page=1'} icon={'restaurant_menu'} text={'MenuItems'} />
                        <NavBarItem href={'/admin/ingredients?page=1'} icon={'grocery'} text={'Ingredients'} />
                        <NavBarItem href={'/admin/reservations'} icon={'book_online'} text={'Reservations'} />
                        <NavBarItem href={'/admin/settings'} icon={'settings'} text={'Settings'} />

                        <hr />

                        {/* <NavBarItem href={'/kitchen/receive/order'} icon={'orders'} text={'Complete orders'} /> */}

                        <NavBarItem href={'/kitchen/receive/order/food'} icon={'restaurant'} text={'Food orders'} />
                        <NavBarItem href={'/kitchen/receive/order/drinks'} icon={'wine_bar'} text={'Drinks orders'} />
                        <hr />
                        <NavBarItem href={'/kitchen/waiter/food'} icon={'restaurant'} text={'Food ready for serving'} />
                        <NavBarItem href={'/kitchen/waiter/drinks'} icon={'wine_bar'} text={'Drinks ready for serving'} />
                    </ul>
                    <ul className="space-y-2 font-medium text-lg">
                        <LogoutButton onClick={logout} />
                    </ul>
                </div>
            </aside>
        </div>
    )
}

export default SideNav
