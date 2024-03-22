import {useContext, useEffect, useState} from "react";
import ConfigContext from "../../provider/ConfigProvider.jsx";

import Nav from "../navigation/Nav.jsx";
import ToastNotification from "../notifications/ToastNotification.jsx";

function CartOverview() {
    const config = useContext(ConfigContext);
    const [isLoading, setIsLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (!config) return;
        fetchCartItems().then(r => r);
    }, [config]);

    async function fetchCartItems() {
        setIsLoading(true);
        const response = await fetch(`${config.API_URL}/api/v1/CartItem/${localStorage.getItem("deviceId")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        });
        setIsLoading(false);

        if (response.status === 200) {
            const data = await response.json();
            setCartItems(data.cartItems);
        }
    }

    async function handlePlus(id) {
        const response = await fetch(`${config.API_URL}/api/v1/CartItem`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                menuItemId: id,
                deviceId: localStorage.getItem("deviceId"),
            }),
        });

        if (response.status === 204) {
            await fetchCartItems();
        } else {
            ToastNotification('error', 'Error while adding item to order');
        }
    }

    async function handleMinus(id) {
        const response = await fetch(`${config.API_URL}/api/v1/CartItem`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                menuItemId: id,
                deviceId: localStorage.getItem("deviceId"),
            }),
        });

        if (response.status === 204) {
            await fetchCartItems();
        } else {
            ToastNotification('error', 'Error while removing item from order');
        }
    }

    return (
        <div className="relative flex flex-col justify-between min-h-screen">
            <div>
                <Nav/>

                <div className="mt-6 w-full flex justify-center">
                    <div className="w-96 md:w-[500px]">
                        <div className="title-box text-2xl font-bold w-full px-2">
                            <p className="text-left">Your Order</p>
                        </div>
                        <div className="min-h-screen flex flex-col px-2">
                            {
                                cartItems.map((cartItem) => {
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
                                                        className="count-box rounded-md overflow-hidden bg-white h-8 w-full flex text-lg">
                                                        <button onClick={() => handleMinus(cartItem.id)}
                                                            className="w-1/3 h-full bg-gray-300 font-bold flex items-center justify-center">
                                                            -
                                                        </button>
                                                        <div
                                                            className="w-1/3 font-bold flex items-center justify-center">
                                                            {cartItem.quantity}
                                                        </div>
                                                        <button onClick={() => handlePlus(cartItem.id)}
                                                            className="w-1/3 h-full bg-gray-300 font-bold flex items-center justify-center">
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className="bottom-box w-full pt-3 sticky bottom-0 left-0" style={{backgroundColor: "rgb(255,255,255,.8)"}}>
                            <div className="total-box h-1/2 flex items-center justify-center text-2xl font-bold">
                                Your Total: €3,00
                            </div>
                            <div className="checkout-btn text-2xl w-full h-1/2 flex items-center justify-center">
                                <button
                                    className="flex items-center py-2 h-full text-white rounded-2xl italic mb-3 justify-center w-9/12 bg-red-500 hover:bg-red-600">
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
