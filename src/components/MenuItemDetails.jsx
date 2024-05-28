import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../provider/ConfigProvider.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import ToastNotification from './notifications/ToastNotification.jsx'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import SettingsContext from '../provider/SettingsProvider.jsx'

function MenuItemDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const config = useContext(ConfigContext)
    const [menuItem, setMenuItem] = useState(null)
    const { t } = useTranslation()
    const setting = useContext(SettingsContext)

    useEffect(() => {
        if (config) {
            fetchMenuItem().then((r) => r)
        }
    }, [config])

    async function fetchMenuItem() {
        const response = await fetch(`${config.API_URL}/api/v1/MenuItem/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': localStorage.getItem('i18nextLng') || 'en',
            },
        })

        if (response.status === 200) {
            const data = await response.json()
            setMenuItem(data)
        } else {
            console.error("Couldn't retrieve the menu item")
        }
    }

    async function addToOrder() {
        if (!localStorage.getItem('tableSessionId')) {
            toast.error(t('Please scan the QR-Code on your table using your camera on your phone'), {
                autoClose: 8000,
            })
            return
        }

        try {
            const selectedIngredients = menuItem.ingredients.filter((ingredient) => {
                const checkbox = document.getElementById(`ingredient-${ingredient.id}`)
                return checkbox && !checkbox.checked
            })

            const response = await fetch(`${config.API_URL}/api/v1/CartItem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': localStorage.getItem('i18nextLng') || 'en',
                },
                body: JSON.stringify({
                    menuItemId: id,
                    tableSessionId: localStorage.getItem('tableSessionId'),
                    note: document.getElementById('note').value === '' ? undefined : document.getElementById('note').value,
                    excludedIngredients: selectedIngredients.map((ingredient) => ingredient.name),
                }),
            })

            if (response.status === 204) {
                ToastNotification('success', t('Added item to order'))
                navigate('/')
            } else if (response.status === 404) {
                toast.error(t('Please scan the QR-Code on your table using your camera on your phone'), {
                    autoClose: 8000,
                })
            } else {
                ToastNotification('error', t('Failed to add menu item'))
            }
        } catch (error) {
            ToastNotification('error', t('Error adding menu item'))
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
                                onClick={() => navigate('/')}
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
                                    {menuItem && (
                                        <div>
                                            <img src={menuItem.imageUrl} className="w-full rounded-lg shadow-xl object-cover h-80" alt="" />

                                            <div className="md:px-10">
                                                <div className="w-full flex justify-between">
                                                    <p className="pt-8 pb-5 text-2xl font-bold">{menuItem.name}</p>
                                                    <p className="pt-8 pb-5 text-2xl font-bold">{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(menuItem.price / 100)}</p>
                                                </div>

                                                <hr className="border border-gray-600 sm:mx-auto rounded-lg" />

                                                <p className="pt-5 font-bold">{t('Description')}</p>

                                                <p className="pt-2 whitespace">{menuItem.description}</p>

                                                {menuItem.ingredients.length !== 0 && (
                                                    <div>
                                                        <p className="pt-5 font-bold">{t('Ingredients')}</p>

                                                        <div className="pt-4">
                                                            {menuItem.ingredients.map((ingredient) => (
                                                                <div key={ingredient.id}>
                                                                    <div className="flex pb-2">
                                                                        <input defaultChecked type="checkbox" id={`ingredient-${ingredient.id}`} className="w-8 h-8 shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" />
                                                                        <label htmlFor={`ingredient-${ingredient.id}`} className="ml-3 mt-2">
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
                                                    <textarea id="note" rows="4" className="block min-h-32 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500" placeholder={t('Leave a note') + '...'}></textarea>
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
                    {menuItem && (
                        <button
                            className={`flex items-center py-2 h-full text-white rounded-2xl italic mb-3 justify-center w-9/12 ${menuItem.isActive ? `bg-[${setting.primaryColor}] hover:bg-[${setting.secondaryColor}]` : 'bg-gray-400 cursor-not-allowed'}`}
                            onClick={addToOrder}
                            disabled={!menuItem.isActive}
                        >
                            {t('Add to order')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
export default MenuItemDetails
