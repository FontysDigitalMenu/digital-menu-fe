import { Outlet } from 'react-router-dom';
import StaffNav from './navigation/StaffNav'

function KitchenRoot({ setIsAuthenticated }) {
    return (
        <>
            <StaffNav/>
            <Outlet />
        </>
    )
}
export default KitchenRoot
