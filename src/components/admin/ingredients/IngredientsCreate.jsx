import React, { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../../provider/ConfigProvider.jsx'
import ToastNotification from '../../notifications/ToastNotification.jsx'
import { useNavigate } from 'react-router-dom'

function IngredientsCreate() {
    const navigate = useNavigate()
    const config = useContext(ConfigContext)
    const [ingredient, setIngredient] = useState({
        name: '',
        stock: 0,
    })

    const handleCreateIngredient = async () => {
        try {
            const response = await fetch(`${config.API_URL}/api/v1/ingredients`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: ingredient.name,
                    stock: ingredient.stock,
                }),
            })

            if (response.status === 201) {
                ToastNotification('success', 'Ingredient created successfully')

                return navigate('/admin/ingredients')
            } else {
                ToastNotification('error', 'Failed to create ingredient')
            }
        } catch (error) {
            ToastNotification('error', 'Error creating ingredient:', error)
        }
    }

    return (
        <div className="p-4 sm:ml-64">
            <h1 className="text-4xl mb-10 font-bold">Create ingredient</h1>

            <form className="max-w-lg mx-auto">
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                        Name
                    </label>
                    <input type="text" id="name" className="block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-red-500 focus:border-red-500" required value={ingredient.name} onChange={(e) => setIngredient({ ...ingredient, name: e.target.value })} />
                </div>
                <div className="mb-5">
                    <label htmlFor="stock" className="block mb-2 text-sm font-medium text-gray-900">
                        Stock
                    </label>
                    <input
                        type="number"
                        id="stock"
                        className="block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-red-500 focus:border-red-500"
                        required
                        value={ingredient.stock}
                        onChange={(e) => setIngredient({ ...ingredient, stock: parseInt(e.target.value) })}
                    />
                </div>

                <div className="mb-5 flex w-full justify-end">
                    <button type="button" onClick={handleCreateIngredient} className={'bg-red-500 border border-red-500 text-white rounded px-4 py-2'}>
                        Create ingredient
                    </button>
                </div>
            </form>
        </div>
    )
}

export default IngredientsCreate
