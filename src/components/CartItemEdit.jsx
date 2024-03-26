import { useContext, useEffect, useState, useRef } from "react";
import ConfigContext from "../provider/ConfigProvider.jsx";
import Nav from "./navigation/Nav.jsx";
import {useNavigate, useParams} from "react-router-dom";
import ToastNotification from "./notifications/ToastNotification.jsx";

function CartItemEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const config = useContext(ConfigContext);
    const [cartItemWithExcludedIngredients, setCartItemWithExcludedIngredients] = useState(null);

    useEffect(() => {
        if (config) {
            fetchMenuItem().then(r => r);
        }
    }, [config]);

    async function fetchMenuItem() {
        const deviceId = localStorage.getItem("deviceId");

        const response = await fetch(`${config.API_URL}/api/v1/CartItem?cartItemId=${id}&deviceId=${deviceId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            setCartItemWithExcludedIngredients(data);
        } else {
            console.error("Couldn't retrieve the menu item");
        }
    }

    async function handleCartItemSave() {
        try {
            const selectedIngredients = cartItemWithExcludedIngredients.cartItem.menuItem.ingredients.filter(ingredient => {
                const checkbox = document.getElementById(`ingredient-checkbox-${ingredient.id}`);
                return checkbox && !checkbox.checked;
            });

            const response = await fetch(`${config.API_URL}/api/v1/CartItem/updateDetails`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cartItemId: id,
                    deviceId: localStorage.getItem("deviceId"),
                    note: document.getElementById('note').value === "" ? undefined : document.getElementById('note').value,
                    excludedIngredients: selectedIngredients.map(ingredient => ingredient.name)
                }),
            });

            if (response.status === 204) {
                ToastNotification("success", "Saved cart item");
                navigate("/cart");
            } else {
                ToastNotification("error", "Failed to save cart item");
            }
        } catch (error) {
            ToastNotification("error", "Error while saving the cart item");
        }
    }

    return (
        <div className="relative flex flex-col justify-between min-h-screen">
            <div className="min-h-screen flex flex-col bg-gray-50">
                <div className="p-2 md:p-4">
                    <div>
                        <div className="pt-10">
                            <div className="px-8 md:px-16 md:flex justify-center">
                                <div className="flex flex-col md:w-[800px]">
                                    {cartItemWithExcludedIngredients && cartItemWithExcludedIngredients.cartItem &&
                                        <div>
                                            <img src={cartItemWithExcludedIngredients.cartItem.menuItem.imageUrl} className="w-full rounded-lg shadow-xl object-cover h-80" alt=""/>

                                            <div className="md:px-10">
                                                <div className="w-full flex justify-between">
                                                    <p className="pt-8 pb-5 text-2xl font-bold">{cartItemWithExcludedIngredients.cartItem.menuItem.name}</p>
                                                    <p className="pt-8 pb-5 text-2xl font-bold">{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cartItemWithExcludedIngredients.cartItem.menuItem.price / 100)}</p>
                                                </div>

                                                <hr className="border border-gray-600 sm:mx-auto rounded-lg" />

                                                <p className="pt-5 font-bold">
                                                    Description
                                                </p>

                                                <p className="pt-2 whitespace">{cartItemWithExcludedIngredients.cartItem.menuItem.description}</p>

                                                {cartItemWithExcludedIngredients.cartItem.menuItem.ingredients.length !== 0 &&
                                                    <div>
                                                        <p className="pt-5 font-bold">
                                                            Ingredients
                                                        </p>

                                                        <div className="pt-4">
                                                            {cartItemWithExcludedIngredients.cartItem.menuItem.ingredients.map((ingredient) => (
                                                                <div key={ingredient.id}>
                                                                    <div className="flex pb-2">
                                                                        <input
                                                                            defaultChecked={!cartItemWithExcludedIngredients.excludedIngredients.some(excluded => excluded.id === ingredient.id)}
                                                                            type="checkbox"
                                                                            className="w-8 h-8 shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                                                            id={`ingredient-checkbox-${ingredient.id}`}
                                                                        />
                                                                        <label htmlFor={`ingredient-checkbox-${ingredient.id}`} className="ml-3 mt-2">{ingredient.name}</label>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                }

                                                <p className="pt-5 font-bold">
                                                    Note
                                                </p>

                                                <form className="w-full pt-2">
                                                    <textarea id="note" rows="4" defaultValue={cartItemWithExcludedIngredients.cartItem.note} className="block min-h-32 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500" placeholder="Leave a note..."></textarea>
                                                </form>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="bottom-of-page" style={{ height: "1px" }}></div>
                </div>
            </div>

            <div className="bottom-box w-full pt-3 sticky bottom-0 left-0"
                 style={{backgroundColor: "rgb(255,255,255,.8)"}}>
                <div className="checkout-btn text-2xl w-full h-1/2 flex items-center justify-center">
                    <button
                        className="flex items-center py-2 h-full text-white rounded-2xl italic mb-3 justify-center w-9/12 bg-red-500 hover:bg-red-600"
                        onClick={handleCartItemSave}>
                        Save Menu Item
                    </button>
                </div>
            </div>
        </div>
    );
}
export default CartItemEdit;
