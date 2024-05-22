import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../../provider/ConfigProvider.jsx'
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'
import ToastNotification from '../../notifications/ToastNotification.jsx'
import { useNavigate } from 'react-router-dom'
import CurrencyInput from 'react-currency-input-field'
import { useTranslation } from 'react-i18next'

function MenuItemsCreate() {
    const navigate = useNavigate()
    const config = useContext(ConfigContext)
    const { t } = useTranslation()
    const [categories, setCategories] = useState([])
    const [ingredients, setIngredients] = useState([])
    const [dynamicDivs, setDynamicDivs] = useState([{ ingredient: '', amount: '1' }])
    const [menuData, setMenuData] = useState({
        formLanguage: 'en',
        name: '',
        price: 0.0,
        description: '',
        categories: [],
        ingredients: [],
        image: null,
    })
    const [imageUrl, setImageUrl] = useState(null)

    useEffect(() => {
        if (!config) return
        fetchIngredients().then((r) => r)
        fetchCategories().then((r) => r)
    }, [config])

    async function fetchIngredients() {
        const response = await fetch(`${config.API_URL}/api/v1/ingredients`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })

        const data = await response.json()
        setIngredients(data)
    }

    async function fetchCategories() {
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

    const handleIngredientChange = (newValue, index) => {
        const updatedDivs = [...dynamicDivs]
        updatedDivs[index].ingredient = newValue
        setDynamicDivs(updatedDivs)

        const updatedMenuData = [...menuData.ingredients]
        updatedMenuData[index] = { ingredient: newValue, amount: updatedDivs[index].amount }
        setMenuData({ ...menuData, ingredients: updatedMenuData })
    }

    const handleAmountChange = (e, index) => {
        const updatedDivs = [...dynamicDivs]
        updatedDivs[index].amount = e.target.value
        setDynamicDivs(updatedDivs)

        const updatedMenuData = [...menuData.ingredients]
        updatedMenuData[index] = { ingredient: updatedDivs[index].ingredient, amount: e.target.value }
        setMenuData({ ...menuData, ingredients: updatedMenuData })
    }

    const handleAddDiv = () => {
        setDynamicDivs([...dynamicDivs, { ingredient: '', amount: '1' }])
        setMenuData({ ...menuData, ingredients: [...menuData.ingredients, { ingredient: '', amount: '1' }] })
    }

    const handleDeleteDiv = (index) => {
        const updatedDivs = [...dynamicDivs]
        updatedDivs.splice(index, 1)
        setDynamicDivs(updatedDivs)

        const updatedMenuData = [...menuData.ingredients]
        updatedMenuData.splice(index, 1)
        setMenuData({ ...menuData, ingredients: updatedMenuData })
    }

    const handlePriceChange = (value) => {
        setMenuData({ ...menuData, price: value })
    }

    const handleCreateMenuItem = async () => {
        try {
            const formData = new FormData()
            formData.append('formLanguage', menuData.formLanguage)
            formData.append('name', menuData.name)
            formData.append('price', menuData.price)
            formData.append('description', menuData.description)

            menuData.categories.forEach((category) => {
                formData.append('categories', category.value)
            })

            const ingredientNames = menuData.ingredients.map((ingredient) => ingredient.ingredient.value)
            const ingredientAmounts = menuData.ingredients.map((ingredient) => ingredient.amount)

            ingredientNames.forEach((ingredientName) => {
                formData.append('IngredientsName', ingredientName)
            })

            ingredientAmounts.forEach((amount) => {
                formData.append('IngredientsAmount', amount)
            })

            formData.append('image', menuData.image)

            const response = await fetch(`${config.API_URL}/api/v1/menuItem`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                },
                body: formData,
            })
            if (response.status === 201) {
                ToastNotification('success', 'Menu item created successfully')

                return navigate('/admin/menuItems')
            } else {
                ToastNotification('error', 'Failed to create menu item')
            }
        } catch (error) {
            ToastNotification('error', 'Error creating menu item:', error)
        }
    }

    return (
        <div className="p-4 sm:ml-64">
            <h1 className="text-4xl mb-10 font-bold">{t('Create menu item')}</h1>

            <form className="max-w-lg mx-auto">
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                        {t('Form language')}
                    </label>
                    <Select
                        name="form language"
                        defaultValue={{ value: 'en', label: 'en' }}
                        onChange={(e) => setMenuData({ ...menuData, formLanguage: e.value })}
                        options={[
                            {
                                value: 'en',
                                label: 'en',
                            },
                            {
                                value: 'nl',
                                label: 'nl',
                            },
                            {
                                value: 'de',
                                label: 'de',
                            },
                        ]}
                        className="w-full"
                        required
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                        {t('Name')}
                    </label>
                    <input type="text" id="name" className="block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-red-500 focus:border-red-500" required value={menuData.name} onChange={(e) => setMenuData({ ...menuData, name: e.target.value })} />
                </div>
                <div className="mb-5">
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">
                        {t('Price')}
                    </label>
                    <CurrencyInput
                        id="price"
                        name="price"
                        decimalSeparator=","
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                        intlConfig={{ locale: 'nl-NL', currency: 'EUR' }}
                        defaultValue={menuData.price}
                        value={menuData.price}
                        decimalsLimit={2}
                        fixedDecimalLength={2}
                        onValueChange={handlePriceChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">
                        {t('Description')}
                    </label>
                    <textarea
                        id="message"
                        rows="4"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500"
                        required
                        value={menuData.description}
                        onChange={(e) => setMenuData({ ...menuData, description: e.target.value })}
                    ></textarea>
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="categories">
                        {t('Categories')}
                    </label>
                    <CreatableSelect
                        isMulti
                        name="categories"
                        value={menuData.categories}
                        onChange={(newValue) => setMenuData({ ...menuData, categories: newValue })}
                        options={categories.map((category) => ({
                            value: category.name,
                            label: category.name,
                        }))}
                    />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="ingredients">
                        {t('Ingredients')}
                    </label>

                    <div>
                        {dynamicDivs.map((div, index) => (
                            <div key={index} className="flex justify-between gap-4 mb-2">
                                <Select
                                    name="ingredients"
                                    value={div.ingredient}
                                    onChange={(newValue) => handleIngredientChange(newValue, index)}
                                    options={ingredients
                                        .filter((ingredient) => !dynamicDivs.some((div) => div.ingredient.value === ingredient.name))
                                        .map((ingredient) => ({
                                            value: ingredient.name,
                                            label: ingredient.name,
                                        }))}
                                    className="w-full"
                                    required
                                />
                                <input required type="number" value={div.amount} onChange={(e) => handleAmountChange(e, index)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-20 focus:ring-red-500 focus:border-red-500 block" />
                                <button type="button" onClick={() => handleDeleteDiv(index)}>
                                    <span className="material-symbols-outlined text-red-500 mt-1">delete</span>
                                </button>
                            </div>
                        ))}

                        <div className="w-full flex justify-end">
                            <button type="button" onClick={handleAddDiv} className="bg-green-500 border border-green-500 text-white rounded px-4 py-2">
                                {t('Add More')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="image">
                        {t('Upload image')}
                    </label>
                    <input
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        accept="image/*"
                        id="image"
                        type="file"
                        alt="image menu item"
                        onChange={(e) => {
                            const selectedFile = e.target.files[0]
                            setMenuData({ ...menuData, image: selectedFile })
                            setImageUrl(URL.createObjectURL(selectedFile))
                        }}
                    />
                    {imageUrl != null ? <img src={imageUrl} alt="" className="h-32 w-32 mt-4 object-cover" /> : <div></div>}
                </div>

                <div className="mb-5 flex w-full justify-end">
                    <button type="button" onClick={handleCreateMenuItem} className={'bg-red-500 border border-red-500 text-white rounded px-4 py-2'}>
                        {t('Create menu item')}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default MenuItemsCreate
