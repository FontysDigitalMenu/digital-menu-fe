import { Outlet } from 'react-router-dom'
import Nav from './navigation/Nav.jsx'

function Root() {
    return (
        <>
            <Nav />
            <Outlet />
        </>
    )
}
export default Root
