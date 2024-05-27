import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../../provider/ConfigProvider.jsx'
import ButtonCreateNew from '../../elements/ButtonCreateNew.jsx'
import { Button, Modal } from 'flowbite-react'
import {Link, useLocation} from 'react-router-dom'
import IngredientsDelete from './IngredientsDelete.jsx'
import { useTranslation } from 'react-i18next'

function Ingredients() {
    const config = useContext(ConfigContext)
    const location = useLocation()
    const [page, setPage] = useState(1);
    const [buttonPress, setButtonPress] = useState(false);
    const [pageCount, setPageCount] = useState()
    const amount = 9;
    const { t } = useTranslation()
    const [ingredients, setIngredients] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false)
    const [id, setId] = useState(0)
    const [closeCount, setCloseCount] = useState(0)

    function openModal(id) {
        setId(id)
        setIsOpen(true)
    }

    function closeModal() {
        setIsOpen(false)
        setCloseCount((prev) => prev + 1)
    }

    useEffect(() => {
        if (!config) return
        const initialSearchParams = new URLSearchParams(location.search);
        if (page === parseInt(initialSearchParams.get('page'), 10) || buttonPress) {
            fetchIngredients().then((r) => r)
        }
    }, [buttonPress, location.search, page, closeCount, config])

    useEffect(() => {
        const initialSearchParams = new URLSearchParams(location.search);
        if (!initialSearchParams.has('page')) {
            initialSearchParams.set('page', '1');
            const initialSearchString = initialSearchParams.toString();
            window.history.replaceState({}, '', `${location.pathname}?${initialSearchString}`);
        } else {
            setPage(parseInt(initialSearchParams.get('page'), 10));
        }
    }, [location.pathname, location.search]);


    useEffect(() => {
        if (buttonPress){
            const newSearchParams = new URLSearchParams(location.search);
            newSearchParams.set('page', page.toString());
            window.history.replaceState({}, '', `${location.pathname}?${newSearchParams.toString()}`);
            setButtonPress(false)
        }
    }, [buttonPress, page, location.search, location.pathname]);

    const increasePage = ()=> {
        if (page < pageCount){
            setPage(prevPage => prevPage + 1);
            setButtonPress(true);
        }
    }

    const decreasePage = ()=> {
        if (page > 1){
            setPage(prevPage => prevPage - 1);
            setButtonPress(true);
        }
    }

    async function fetchIngredients() {
        const response = await fetch(`${config.API_URL}/api/v1/ingredients/?currentPage=${page}&amount=${amount}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })

        const data = await response.json()
        setIngredients(data.ingredients)
        setPageCount(data.ingredientCount/amount)
    }

    return (
        <div className="p-4 sm:ml-64">
            <Modal show={modalIsOpen} size="md" onClose={() => closeModal()} popup>
                <IngredientsDelete closeModal={closeModal} id={id}/>
            </Modal>

            <h1 className="text-4xl font-bold mb-10">{t('Ingredients')}</h1>

            <div className="sm:flex w-full justify-between mb-4">
                <div className="pt-2">
                    <ButtonCreateNew text={t('Create new')} navigateUrl={'/admin/ingredients/create'}/>
                </div>
                <div className="pt-2">
                    <ButtonCreateNew text={t('Stock')} navigateUrl={'/admin/ingredients/stock'}/>
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Id
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t('Name')}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t('Stock')}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t('Actions')}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {ingredients.map((ingredient) => (
                        <tr key={ingredient.id} className="bg-white border-b">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {ingredient.id}
                            </th>
                            <td className="px-6 py-4">{ingredient.name}</td>
                            <td className="px-6 py-4">{ingredient.stock}</td>
                            <td className="px-6 py-4">
                                <Link to={`/admin/ingredients/${ingredient.id}/edit`}
                                      className="m-1 font-medium text-blue-600 hover:underline">
                                    {t('Edit')}
                                </Link>
                                <button
                                    onClick={() => {
                                        openModal(ingredient.id)
                                    }}
                                    className="text-red-600"
                                >
                                    {t('Delete')}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <ul className="flex justify-center w-full m-2 list-none p-0 text-2xl items-center space-x-4">
                <li>
                    <button
                        onClick={decreasePage}
                        className={`py-1 px-2 text-base text-black p-2 rounded hover:bg-gray-300 focus:outline-none ${
                            page > 1 ? 'bg-gray-200' : 'bg-gray-100 text-gray-400 pointer-events-none'
                        }`}>
                        &lt;
                    </button>
                </li>
                <li>
                    <button className="py-1 px-2 text-base bg-gray-200 text-black p-2 rounded">
                        {page}
                    </button>
                </li>
                <li>
                    <button
                        onClick={increasePage}
                        className={`py-1 px-2 text-base text-black p-2 rounded hover:bg-gray-300 focus:outline-none ${
                            page < pageCount ? 'bg-gray-200' : 'bg-gray-100 text-gray-400 pointer-events-none'
                        }`}>
                        &gt;
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default Ingredients
