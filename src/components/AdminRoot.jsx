import {Outlet} from "react-router-dom";
import SideNav from "./navigation/SideNav.jsx";

function AdminRoot({setIsAuthenticated}){
    return(
        <>
            <SideNav setIsAuthenticated={setIsAuthenticated}/>
            <Outlet/>
        </>
    )
}
export default AdminRoot
