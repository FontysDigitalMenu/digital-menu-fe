import {Outlet} from "react-router-dom";
import SideNav from "./navigation/SideNav.jsx";

function AdminRoot(){
    return(
        <>
            <SideNav/>
            <Outlet/>
        </>
    )
}
export default AdminRoot