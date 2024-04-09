import {useContext, useEffect, useState} from "react";
import ConfigContext from "../../provider/ConfigProvider.jsx";
import waiter from "../../assets/waiter.jpg";
import {useParams} from "react-router-dom";
import pageNotFoundImage from "../../assets/page_not_found.jpg";

function OrderProgress() {
    const config = useContext(ConfigContext);
    const {orderId} = useParams();
    const [order, setOrder] = useState();

    console.log(orderId);

    useEffect(() => {
        if (!config) return;
        fetchOrder(orderId).then(r => r);
    }, [config]);

    async function fetchOrder(orderId) {
        const response = await fetch(`${config.API_URL}/api/v1/Order/${orderId}/${localStorage.getItem("deviceId")}/${localStorage.getItem("tableId")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        if (response.status === 200) {
            setOrder(await response.json());
        } else if (response.status === 404) {
            setOrder(null);
        }
    }

    return (
        <div className="relative flex flex-col justify-between min-h-screen">
            {order ?
                <div>
                    <div className="mt-6 w-full flex justify-center">
                        <div className="w-96 md:w-[500px]">
                            <div className="title-box text-6xl font-bold w-full px-2 mb-6">
                                <p className="text-center">{order && order.paymentStatus === "Paid" ? "Thank you for your order!" : "Processing payment"}</p>
                            </div>
                            <div className="flex justify-start">
                                <img className="w-20" src={waiter} alt=""/>
                            </div>
                            <div className="flex">
                                <div className="rounded-l-lg h-[40px] w-[120px] bg-green-500"></div>
                                <div
                                    className="w-0 h-0
                                  border-t-[20px] border-t-transparent
                                  border-b-[20px] border-b-transparent
                                  border-l-[30px] border-l-green-500
                                  "
                                ></div>
                            </div>
                            <div className="title-box text-2xl font-bold w-full px-2 mt-4">
                                <p className="text-left">Overview</p>
                            </div>
                            <div className="flex flex-col px-2">
                                {order &&
                                    order.menuItems.map((menuItem) => {
                                        return (
                                            <div
                                                key={menuItem.id}
                                                className="bg-gray-100 shadow-lg mt-5 rounded-xl"
                                            >
                                                <div className="product-card w-full h-24 md:h-28 mx-auto flex">
                                                    <div className="image-box h-full flex items-center justify-center">
                                                        <div className="ml-2.5 w-20 bg-white rounded-xl">
                                                            <img
                                                                className="rounded-xl object-cover aspect-square"
                                                                src={menuItem.imageUrl}
                                                                alt="Image product"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="product-box w-6/12 px-2 h-full flex items-center">
                                                        <div className="inner-box size-5/6">
                                                            <p className="name-box first-letter:capitalize h-1/2 font-semibold text-xl">
                                                                {menuItem.name}
                                                            </p>
                                                            <p className="price-box h-1/2 flex items-end text-xl">
                                                                {new Intl.NumberFormat("nl-NL", {
                                                                    style: "currency",
                                                                    currency: "EUR",
                                                                }).format(menuItem.price / 100)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="amount-box h-full w-32">
                                                        <div className="size-full flex items-center justify-center p-2">
                                                            <div
                                                                className="overflow-hidden h-8 w-8 rounded-full bg-white flex text-lg">
                                                                <div
                                                                    className="font-bold flex w-full items-center justify-center">
                                                                    {menuItem.quantity}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="px-3 pb-3 flex flex-col">
                                                    {menuItem.excludedIngredients.map((excludedIngredient) => {
                                                        return (
                                                            <div className="flex gap-2 pt-2">
                                                                <span className="material-symbols-outlined text-red-600">
                                                                    close
                                                                </span>
                                                                <p>{excludedIngredient.name}</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div className="px-3 pb-3 flex justify-between w-full">
                                                    {menuItem.note && (
                                                        <p className="pt-2">{menuItem.note}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                            <div className="total-box text-2xl font-bold w-full px-2 mt-4 mb-4 pt-4">
                                Total: &nbsp;
                                {new Intl.NumberFormat("nl-NL", {
                                    style: "currency",
                                    currency: "EUR",
                                }).format(order ? order.totalAmount / 100 : 0)}
                            </div>
                            <div className="title-box text-2xl font-bold w-full px-2 mt-4 mb-4">
                                <p className="text-left">Order Number: {order.orderNumber}</p>
                            </div>
                        </div>
                    </div>
                </div> :
                <div className="w-full flex justify-center items-center pt-20">
                    <div>
                        <p className="text-8xl font-bold flex justify-center">404</p>

                        <p className="text-4xl font-bold flex justify-center pt-2">Page not found!</p>
                    </div>
                </div>
            }
        </div>
    );
}

export default OrderProgress;
