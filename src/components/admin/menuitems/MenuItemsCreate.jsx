import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../../provider/ConfigProvider.jsx'
import Select from 'react-select'

function MenuItemsCreate() {
    const config = useContext(ConfigContext)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        if (!config) return
        fetchIngredients().then((r) => r)
    }, [config])

    async function fetchIngredients() {
        const response = await fetch(`${config.API_URL}/api/v1/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })

        const data = await response.json()
        setCategories(data)
    }

    return (
        <div className="p-4 sm:ml-64">
            <form className="max-w-sm mx-auto">
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                        Name
                    </label>
                    <input type="text" id="name" className="block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-red-500 focus:border-red-500" />
                </div>
                <div className="mb-5">
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">
                        Price
                    </label>
                    <input type="number" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5" placeholder="" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">
                        Description
                    </label>
                    <textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"></textarea>
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="image">
                        Categories
                    </label>
                    <Select
                        isMulti
                        name="categories"
                        options={categories.map((category) => ({
                            value: category.name,
                            label: category.name,
                        }))}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="image">
                        Upload image
                    </label>
                    <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" accept="image/*" id="image" type="file" alt="image menu item" />
                </div>
            </form>
        </div>
    )
}

export default MenuItemsCreate
