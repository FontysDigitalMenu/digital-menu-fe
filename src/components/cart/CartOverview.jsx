import Nav from "../navigation/Nav.jsx";

function CartOverview() {
    return (
        <div className="relative flex flex-col justify-between min-h-screen">
            <div>
                <Nav />

                <div className="mt-6 w-full flex justify-center">
                    <div className="w-96 md:w-[500px]">
                        <div className="title-box text-2xl font-bold w-full px-2">
                            <p className="text-left">Your Order</p>
                        </div>
                        <div className="min-h-screen flex flex-col px-2">
                            <div className="product-card m-6 w-full h-24 md:h-28 mx-auto bg-gray-100 shadow-lg rounded-xl flex mt-5">
                                <div className="image-box h-full flex items-center justify-center">
                                    <div className=" size-5/6 bg-white rounded-xl">
                                        <img className="rounded-xl object-cover h-full w-full" src="https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg" alt="Image product"/>
                                    </div>
                                </div>
                                <div className="product-box w-6/12 px-2 h-full flex items-center">
                                    <div className="inner-box size-5/6">
                                        <p className="name-box first-letter:capitalize h-1/2 font-semibold text-xl">cola</p>
                                        <p className="price-box h-1/2 flex items-end text-xl">€3,00</p>
                                    </div>
                                </div>
                                <div className="amount-box h-full w-32">
                                    <div className="size-full flex items-center justify-center p-2">
                                        <div className="count-box rounded-md overflow-hidden bg-white h-8 w-full flex text-lg">
                                            <button className="w-1/3 h-full bg-gray-300 font-bold flex items-center justify-center">
                                                -
                                            </button>
                                            <div className="w-1/3 font-bold flex items-center justify-center">
                                                1
                                            </div>
                                            <button className="w-1/3 h-full bg-gray-300 font-bold flex items-center justify-center">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bottom-box w-full sticky bottom-0 left-0">
                            <div className="total-box h-1/2 flex items-center justify-center text-2xl font-bold">
                                Your Total: €3,00
                            </div>
                            <div className="checkout-btn text-2xl w-full h-1/2 flex items-center justify-center">
                                <button className="flex items-center py-2 h-full text-white rounded-2xl italic mb-3 justify-center w-9/12 bg-red-500 hover:bg-red-600">
                                    Checkout Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartOverview
