import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../../provider/ConfigProvider.jsx'
import ButtonCreateNew from '../../elements/ButtonCreateNew.jsx'
// import Modal from "react-modal";
import { Button, Modal } from 'flowbite-react'
import DeleteMenuItem from './MenuItemsDelete.jsx'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function MenuItems() {
    const config = useContext(ConfigContext)
    const { t } = useTranslation()
    const [menuItems, setMenuItems] = useState([])
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
        fetchMenuItems().then((r) => r)
    }, [closeCount, config])

    async function fetchMenuItems() {
        const response = await fetch(`${config.API_URL}/api/v1/menuItem/getMenuItems`, {
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
                                <td className="px-6 py-4">{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(menuItem.price / 100)}</td>
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
        </div>
    )
}

export default MenuItems
