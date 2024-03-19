import React from "react";
import {useNavigate} from "react-router-dom";
import SidebarToggle from "./SideBarToggle.jsx";
import LogoutButton from "./LogoutButton.jsx";
import NavBarItem from "./NavBarItem.jsx";

function SideNav({setIsAuthenticated}) {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        navigate('/login');
    }

    return (
        <div>
            <SidebarToggle />

            <aside id="default-sidebar"
                   className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
                   aria-label="Sidebar">
                <div
                    className="h-full flex flex-col justify-between px-3 py-4 overflow-y-auto bg-red-500">
                    <ul className="space-y-2 font-medium text-lg">
                        <NavBarItem href={'/admin/dashboard'} icon={'home'} text={'Home'} />
                        <NavBarItem href={'/admin/tables'} icon={'table_restaurant'} text={'Tables'} />
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
