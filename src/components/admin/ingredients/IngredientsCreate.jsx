import { useContext, useState } from 'react'
import ConfigContext from '../../../provider/ConfigProvider.jsx'
import ToastNotification from '../../notifications/ToastNotification.jsx'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SettingsContext from '../../../provider/SettingsProvider.jsx'

function IngredientsCreate() {
    const navigate = useNavigate()
    const setting = useContext(SettingsContext)
    const { t } = useTranslation()
    const config = useContext(ConfigContext)
    const [ingredient, setIngredient] = useState({
        formLanguage: 'en',
        name: '',
        stock: 0,
    })

    const handleCreateIngredient = async () => {
        try {
            const response = await fetch(`${config.API_URL}/api/v1/ingredients`, {
                method: 'POST',
                headers: {
                    'Accept-Language': localStorage.getItem('i18nextLng') || 'en',
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: ingredient.name,
                    stock: ingredient.stock,
                    formLanguage: ingredient.formLanguage,
                }),
            })

            if (response.status === 201) {
                ToastNotification('success', t('Ingredient created successfully'))

                return navigate('/admin/ingredients')
            } else {
                ToastNotification('error', t('Failed to create ingredient'))
            }
        } catch (error) {
            ToastNotification('error', t('Error creating ingredient'), error)
        }
    }

    return (
        <div className="p-4 sm:ml-64">
            <h1 className="text-4xl mb-10 font-bold">{t('Create ingredient')}</h1>

            <form className="max-w-lg mx-auto">
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                        {t('Name')}
                    </label>
                    <input
                        type="text"
                        id="name"
                        className={`block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-[${setting.primaryColor}] focus:border-[${setting.primaryColor}]`}
                        required
                        value={ingredient.name}
                        onChange={(e) => setIngredient({ ...ingredient, name: e.target.value })}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="stock" className="block mb-2 text-sm font-medium text-gray-900">
                        {t('Stock')}
                    </label>
                    <input
                        type="number"
                        id="stock"
                        className={`block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-[${setting.primaryColor}] focus:border-[${setting.primaryColor}]`}
                        required
                        value={ingredient.stock}
                        onChange={(e) => setIngredient({ ...ingredient, stock: parseInt(e.target.value) })}
                    />
                </div>

                <div className="mb-5 flex w-full justify-end">
                    <button type="button" onClick={handleCreateIngredient} className={`!bg-[${setting.primaryColor}] hover:!bg-[${setting.secondaryColor}] border border-[${setting.primaryColor}] text-white rounded px-4 py-2`}>
                        {t('Create ingredient')}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default IngredientsCreate
