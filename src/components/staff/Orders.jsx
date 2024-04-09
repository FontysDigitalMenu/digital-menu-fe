import MultipleContainers from '../elements/MultipleContainers'

function Orders() {
    return (
        <div className="h-screen">
            <div className="nav-bar-placeholder bg-gray-200 w-full h-12 flex">
                <div className="nav-item w-1/12 flex justify-center items-center">
                    <p className="font-semibold">DIGITAL MENU</p>
                </div>
            </div>
            <div className="top-text text-center">
                <p className="text-2xl h-8 mb-2">Kitchen</p>
            </div>
            <div className="w-full">
                <MultipleContainers />
            </div>
        </div>
    )
}

export default Orders
