import React, { useContext, useEffect, useState } from 'react'
import ToastNotification from '../../notifications/ToastNotification.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'
import SettingsContext from '../../../provider/SettingsProvider.jsx'
import ConfigContext from '../../../provider/ConfigProvider.jsx'

function IngredientsUpdate() {
    const { id } = useParams()
    const setting = useContext(SettingsContext)
    const navigate = useNavigate()
    const { t } = useTranslation()
    const config = useContext(ConfigContext)
    const [ingredient, setIngredient] = useState({
        name: '',
        stock: 0,
        formLanguage: 'en',
    })

    useEffect(() => {
        if (!config) return
        fetchIngredient().then((r) => r)
    }, [config])

    async function fetchIngredient() {
        const response = await fetch(`${config.API_URL}/api/v1/ingredients/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
            credentials: 'include',
        })

        const data = await response.json()

        const updatedIngredient = {
            name: data.name,
            stock: data.stock,
        }

        setIngredient(updatedIngredient)
    }

    const handleUpdateIngredient = async () => {
        try {
            const response = await fetch(`${config.API_URL}/api/v1/ingredients/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: ingredient.name,
                    stock: ingredient.stock,
                    formLanguage: ingredient.formLanguage,
                }),
            })

            if (response.status === 204) {
                ToastNotification('success', t('Ingredient updated successfully'))

                return navigate('/admin/ingredients')
            } else {
                ToastNotification('error', t('Failed to update ingredient'))
            }
        } catch (error) {
            ToastNotification('error', t('Error updating ingredient'), error)
        }
    }

    return (
        <div className="p-4 sm:ml-64">
            <h1 className="text-4xl mb-10 font-bold">{t('Update ingredient')}</h1>

            <form className="max-w-lg mx-auto">
                {/*123456*/}
                {/*<div className="mb-5">*/}
                {/*    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">*/}
                {/*        {t('Form language')}*/}
                {/*    </label>*/}
                {/*    <Select*/}
                {/*        name="form language"*/}
                {/*        defaultValue={{ value: 'en', label: 'en' }}*/}
                {/*        onChange={(e) => setIngredient({ ...ingredient, formLanguage: e.value })}*/}
                {/*        options={[*/}
                {/*            {*/}
                {/*                value: 'en',*/}
                {/*                label: 'en',*/}
                {/*            },*/}
                {/*            {*/}
                {/*                value: 'nl',*/}
                {/*                label: 'nl',*/}
                {/*            },*/}
                {/*            {*/}
                {/*                value: 'de',*/}
                {/*                label: 'de',*/}
                {/*            },*/}
                {/*            {*/}
                {/*                value: 'ko',*/}
                {/*                label: 'ko',*/}
                {/*            },*/}
                {/*        ]}*/}
                {/*        className="w-full"*/}
                {/*        required*/}
                {/*    />*/}
                {/*</div>*/}
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
                    <button type="button" onClick={handleUpdateIngredient} className={`!bg-[${setting.primaryColor}] hover:!bg-[${setting.secondaryColor}] border border-[${setting.primaryColor}] text-white rounded px-4 py-2`}>
                        {t('Update ingredient')}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default IngredientsUpdate
