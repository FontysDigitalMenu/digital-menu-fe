import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../../provider/ConfigProvider.jsx'
import ButtonCreateNew from '../../elements/ButtonCreateNew.jsx'
import { Modal } from 'flowbite-react'
import DeleteMenuItem from './MenuItemsDelete.jsx'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function MenuItems() {
    const config = useContext(ConfigContext)
    const location = useLocation()
    const [page, setPage] = useState(1)
    const [buttonPress, setButtonPress] = useState(false)
    const [pageCount, setPageCount] = useState(0)
    const amount = 5
    const { t } = useTranslation()
    const [menuItems, setMenuItems] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false)
    const [id, setId] = useState(0)
    const [closeCount, setCloseCount] = useState(0)
    const navigate = useNavigate()

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
        async function fetchMenuItemCount() {
            const response = await fetch(`${config.API_URL}/api/v1/menuItem/count`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                },
            })
            const data = await response.json()
            setPageCount(Math.ceil(data / amount))
        }
        fetchMenuItemCount().then((r) => r)
    }, [config, menuItems, page, location.search])

    useEffect(() => {
        if (!config) return
        const initialSearchParams = new URLSearchParams(location.search)
        if (page === parseInt(initialSearchParams.get('page'), 10) || buttonPress) {
            fetchMenuItems().then((r) => r)
        }
    }, [pageCount, buttonPress, location.search, page, closeCount, config])

    useEffect(() => {
        if (pageCount !== 0) {
            const initialSearchParams = new URLSearchParams(location.search)
            if (!initialSearchParams.has('page') || parseInt(initialSearchParams.get('page'), 10) < 1 || parseInt(initialSearchParams.get('page'), 10) > pageCount) {
                initialSearchParams.set('page', '1')
                const initialSearchString = initialSearchParams.toString()
                navigate(`${location.pathname}?${initialSearchString}`, { replace: true })
            } else {
                setPage(parseInt(initialSearchParams.get('page'), 10))
            }
        }
    }, [pageCount, location.pathname, location.search])

    useEffect(() => {
        if (buttonPress) {
            const newSearchParams = new URLSearchParams(location.search)
            newSearchParams.set('page', page.toString())
            navigate(`${location.pathname}?${newSearchParams}`, { replace: true })
            setButtonPress(false)
        }
    }, [buttonPress, page, location.search, location.pathname])

    const increasePage = () => {
        if (page < pageCount) {
            setPage((prevPage) => prevPage + 1)
            setButtonPress(true)
        }
    }

    const decreasePage = () => {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1)
            setButtonPress(true)
        }
    }

    async function fetchMenuItems() {
        const response = await fetch(`${config.API_URL}/api/v1/menuItem/getMenuItems/?currentPage=${page}&amount=${amount}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })

        const data = await response.json()
        setMenuItems(data)
    }

    return (
        <div className="p-4 sm:ml-64">
            <Modal show={modalIsOpen} size="md" onClose={() => closeModal()} popup>
                <DeleteMenuItem closeModal={closeModal} id={id} />
            </Modal>

            <h1 className="text-4xl font-bold mb-10">{t('MenuItems')}</h1>

            <div className="sm:flex w-full justify-between mb-4">
                {/*<div className="w-96">*/}
                {/*    <form className="max-w-md mx-auto">*/}
                {/*        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">*/}
                {/*            Search*/}
                {/*        </label>*/}
                {/*        <div className="relative">*/}
                {/*            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">*/}
                {/*                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">*/}
                {/*                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />*/}
                {/*                </svg>*/}
                {/*            </div>*/}
                {/*            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500" placeholder="Search menu items" required />*/}
                {/*            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-500 font-medium rounded-lg text-sm px-4 py-2">*/}
                {/*                Search*/}
                {/*            </button>*/}
                {/*        </div>*/}
                {/*    </form>*/}
                {/*</div>*/}

                <div className="pt-2">
                    <ButtonCreateNew text={t('Create new')} navigateUrl={'/admin/menuItems/create'} />
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
                                {t('Price')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('Image')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('Actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map((menuItem) => (
                            <tr key={menuItem.id} className="bg-white border-b">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {menuItem.id}
                                </th>
                                <td className="px-6 py-4">{menuItem.name}</td>
                                <td className="px-6 py-4">
                                    {new Intl.NumberFormat('nl-NL', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(menuItem.price / 100)}
                                </td>
                                <td className="px-6 py-4">
                                    <img src={menuItem.imageUrl} alt={menuItem.name} className="h-16 w-16 object-cover" />
                                </td>
                                <td className="px-6 py-4">
                                    <Link to={`/admin/menuItems/${menuItem.id}/edit`} className="m-1 font-medium text-blue-600 hover:underline">
                                        {t('Edit')}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            openModal(menuItem.id)
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
                    <button onClick={decreasePage} className={`py-1 px-2 text-base text-black p-2 rounded hover:bg-gray-300 focus:outline-none ${page > 1 ? 'bg-gray-200' : 'bg-gray-100 text-gray-400 pointer-events-none'}`}>
                        &lt;
                    </button>
                </li>
                <li>
                    <button className="py-1 px-2 text-base bg-gray-200 text-black p-2 rounded">{page}</button>
                </li>
                <li>
                    <button onClick={increasePage} className={`py-1 px-2 text-base text-black p-2 rounded hover:bg-gray-300 focus:outline-none ${page < pageCount ? 'bg-gray-200' : 'bg-gray-100 text-gray-400 pointer-events-none'}`}>
                        &gt;
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default MenuItems
