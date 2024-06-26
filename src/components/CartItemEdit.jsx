import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../provider/ConfigProvider.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import ToastNotification from './notifications/ToastNotification.jsx'
import { useTranslation } from 'react-i18next'
import SettingsContext from '../provider/SettingsProvider.jsx'

function CartItemEdit() {
    const { id } = useParams()
    const setting = useContext(SettingsContext)
    const { t } = useTranslation()
    const navigate = useNavigate()
    const config = useContext(ConfigContext)
    const [cartItemWithExcludedIngredients, setCartItemWithExcludedIngredients] = useState(null)

    useEffect(() => {
        if (config) {
            fetchMenuItem().then((r) => r)
        }
    }, [config])

    async function fetchMenuItem() {
        const tableSessionId = localStorage.getItem('tableSessionId')

        const response = await fetch(`${config.API_URL}/api/v1/CartItem?cartItemId=${id}&tableSessionId=${tableSessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Accept-Language': localStorage.getItem('i18nextLng') || 'en',
            },
        })

        if (response.status === 200) {
            const data = await response.json()
            setCartItemWithExcludedIngredients(data)
        } else {
            console.error("Couldn't retrieve the menu item")
        }
    }

    async function handleCartItemSave() {
        try {
            const selectedIngredients = cartItemWithExcludedIngredients.cartItem.menuItem.ingredients.filter((ingredient) => {
                const checkbox = document.getElementById(`ingredient-checkbox-${ingredient.id}`)
                return checkbox && !checkbox.checked
            })

            const response = await fetch(`${config.API_URL}/api/v1/CartItem/updateDetails`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartItemId: id,
                    tableSessionId: localStorage.getItem('tableSessionId'),
                    note: document.getElementById('note').value === '' ? undefined : document.getElementById('note').value,
                    excludedIngredients: selectedIngredients.map((ingredient) => ingredient.name),
                }),
            })

            if (response.status === 204) {
                ToastNotification('success', t('Saved cart item'))
                navigate('/cart')
            } else {
                ToastNotification('error', t('Failed to save cart item'))
            }
        } catch (error) {
            ToastNotification('error', t('Error while saving the cart item'))
        }
    }

    return (
        <div className="relative flex flex-col justify-between min-h-screen">
            <div className="min-h-screen flex flex-col bg-gray-50">
                <div className="p-2 md:p-4">
                    <div>
                        <div className="px-2 pt-4">
                            <button
                                className=" py-2.5 px-5 rounded-lg"
                                style={{
                                    boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.1)',
                                }}
                                onClick={() => navigate('/cart')}
                            >
                                <div className="flex gap-2 pt-1">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    <p className="text-lg font-medium">{t('Back')}</p>
                                </div>
                            </button>
                        </div>
                        <div className="pt-10">
                            <div className="px-8 md:px-16 md:flex justify-center">
                                <div className="flex flex-col md:w-[800px]">
                                    {cartItemWithExcludedIngredients && cartItemWithExcludedIngredients.cartItem && (
                                        <div>
                                            <img src={cartItemWithExcludedIngredients.cartItem.menuItem.imageUrl} className="w-full rounded-lg shadow-xl object-cover h-80" alt="" />

                                            <div className="md:px-10">
                                                <div className="w-full flex justify-between">
                                                    <p className="pt-8 pb-5 text-2xl font-bold">{cartItemWithExcludedIngredients.cartItem.menuItem.name}</p>
                                                    <p className="pt-8 pb-5 text-2xl font-bold">{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cartItemWithExcludedIngredients.cartItem.menuItem.price / 100)}</p>
                                                </div>

                                                <hr className="border border-gray-600 sm:mx-auto rounded-lg" />

                                                <p className="pt-5 font-bold">{t('Description')}</p>

                                                <p className="pt-2 whitespace">{cartItemWithExcludedIngredients.cartItem.menuItem.description}</p>

                                                {cartItemWithExcludedIngredients.cartItem.menuItem.ingredients.length !== 0 && (
                                                    <div>
                                                        <p className="pt-5 font-bold">{t('Ingredients')}</p>

                                                        <div className="pt-4">
                                                            {cartItemWithExcludedIngredients.cartItem.menuItem.ingredients.map((ingredient) => (
                                                                <div key={ingredient.id}>
                                                                    <div className="flex pb-2">
                                                                        <input
                                                                            defaultChecked={!cartItemWithExcludedIngredients.excludedIngredients.some((excluded) => excluded.id === ingredient.id)}
                                                                            type="checkbox"
                                                                            className="w-8 h-8 shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                                                            id={`ingredient-checkbox-${ingredient.id}`}
                                                                        />
                                                                        <label htmlFor={`ingredient-checkbox-${ingredient.id}`} className="ml-3 mt-2">
                                                                            {ingredient.name}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <p className="pt-5 font-bold">{t('Note')}</p>

                                                <form className="w-full pt-2">
                                                    <textarea
                                                        id="note"
                                                        rows="4"
                                                        defaultValue={cartItemWithExcludedIngredients.cartItem.note}
                                                        className={`block min-h-32 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-[${setting.primaryColor}] focus:border-[${setting.primaryColor}]`}
                                                        placeholder={t('Leave a note') + '...'}
                                                    ></textarea>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="bottom-of-page" style={{ height: '1px' }}></div>
                </div>
            </div>

            <div className="bottom-box w-full pt-3 sticky bottom-0 left-0" style={{ backgroundColor: 'rgb(255,255,255,.8)' }}>
                <div className="text-2xl w-full h-1/2 flex items-center justify-center">
                    <button className={`flex items-center py-2 h-full text-white rounded-2xl italic mb-3 justify-center w-9/12 bg-[${setting.primaryColor}] hover:bg-[${setting.secondaryColor}]`} onClick={handleCartItemSave}>
                        {t('Save Menu Item')}
                    </button>
                </div>
            </div>
        </div>
    )
}
export default CartItemEdit
