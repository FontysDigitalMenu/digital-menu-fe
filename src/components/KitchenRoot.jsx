import { Outlet } from 'react-router-dom'

function KitchenRoot({ setIsAuthenticated }) {
    return (
        <>
            <Outlet />
        </>
    )
}
export default KitchenRoot
