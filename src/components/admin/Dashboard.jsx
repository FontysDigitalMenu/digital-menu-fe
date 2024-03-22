import SideNav from "../navigation/SideNav.jsx";

function Dashboard({setIsAuthenticated}){
    return (
        <div>
            <SideNav setIsAuthenticated={setIsAuthenticated}/>

            <div className="p-4 sm:ml-64">
                Dashboard menu
            </div>
        </div>
    )
}
export default Dashboard
