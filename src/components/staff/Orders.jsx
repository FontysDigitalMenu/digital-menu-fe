import MultipleContainers from '../elements/MultipleContainers';

function Orders() {
    return (
        <div className="h-screen">
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
