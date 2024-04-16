import { Link } from 'react-router-dom'

function StaffNav() {
    return (
        <div className="staffnav mb-4 flex w-full text-white h-12" style={{ backgroundColor: '#EF4444', borderBottomColor: 'white', borderBottomWidth: '2px' }}>
            <div className="sm:w-[15%] h-full flex sm:pl-2 justify-center sm:justify-normal items-center text-xl w-[40%]">
                <div>
                    <Link to="/admin">DIGITAL MENU</Link>
                </div>
            </div>
            <div className="sm:w-[85%] h-full sm:gap-7 flex text-lg items-center w-[60%] justify-center sm:justify-normal gap-2">
                <div></div>
                <Link to="/kitchen/receive/order/food">Kitchen</Link>
                <Link to="/kitchen/recieve/order/drinks">Bar</Link>
            </div>
        </div>
    )
}

export default StaffNav
