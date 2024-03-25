import {useContext, useEffect, useState} from "react";
import ConfigContext from "../../provider/ConfigProvider.jsx";
import waiter from "../../assets/waiter.jpg"
function OrderProgress(){
    const config = useContext(ConfigContext);
    const [cartItemCollection, setCartItemCollection] = useState();

    useEffect(() => {
        if (!config) return;
        fetchCartItems().then(r => r);
    }, [config]);

    async function fetchCartItems() {
        const response = await fetch(`${config.API_URL}/api/v1/CartItem/${localStorage.getItem("deviceId")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            setCartItemCollection(data);
        } else if (response.status === 404) {
            setCartItemCollection(null);
        }
    }

    return (
        <div className="relative flex flex-col justify-between min-h-screen">

            <div>
                <div className="mt-6 w-full flex justify-center">
                    <div className="w-96 md:w-[500px]">
                        <div className="title-box text-6xl font-bold w-full px-2 mb-6">
                            <p className="text-center">Thank you for your order!</p>
                        </div>
                        <div className="flex justify-start">
                            <img className="w-20" src={waiter} alt=""/>
                        </div>
                        <div className="flex">
                            <div className="rounded-l-lg h-[40px] w-[120px] bg-green-500">
                            </div>
                            <div className="w-0 h-0
                              border-t-[20px] border-t-transparent
                              border-b-[20px] border-b-transparent
                              border-l-[30px] border-l-green-500
                              ">
                            </div>
                        </div>
                        <div className="title-box text-2xl font-bold w-full px-2">
                            <p className="text-left">Overview</p>
                        </div>
                        <div className="min-h-screen flex flex-col px-2">
                            {
                                cartItemCollection && cartItemCollection.cartItems.map((cartItem) => {
                                    return (
                                        <div key={cartItem.id}
                                             className="product-card w-full h-24 md:h-28 mx-auto bg-gray-100 shadow-lg rounded-xl flex mt-5">
                                            <div className="image-box h-full flex items-center justify-center">
                                                <div className="ml-2.5 w-20 bg-white rounded-xl">
                                                    <img className="rounded-xl object-cover aspect-square"
                                                         src={cartItem.menuItem.imageUrl}
                                                         alt="Image product"/>
                                                </div>
                                            </div>
                                            <div className="product-box w-6/12 px-2 h-full flex items-center">
                                                <div className="inner-box size-5/6">
                                                    <p className="name-box first-letter:capitalize h-1/2 font-semibold text-xl">{cartItem.menuItem.name}</p>
                                                    <p className="price-box h-1/2 flex items-end text-xl">
                                                        {new Intl.NumberFormat('nl-NL', {
                                                            style: 'currency',
                                                            currency: 'EUR'
                                                        }).format(cartItem.menuItem.price / 100)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="amount-box h-full w-32">
                                                <div className="size-full flex items-center justify-center p-2">
                                                    <div
                                                        className="overflow-hidden h-8 w-8 rounded-full bg-white flex text-lg">
                                                        <div className="font-bold flex w-full items-center justify-center">
                                                            {cartItem.quantity}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderProgress