import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../../provider/ConfigProvider.jsx'
import { Modal } from 'flowbite-react'
import IngredientsDelete from './IngredientsDelete.jsx'
import { startConnectionForIngredients, startListenForIngredients, stopListenForIngredients } from '../../../services/IngredientHubConnection.jsx'
import { useTranslation } from 'react-i18next'

function IngredientsStock() {
    const config = useContext(ConfigContext)
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
        fetchIngredients().then((r) => r)
    }, [closeCount, config])

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
        data.sort((a, b) => a.stock - b.stock)
        setIngredients(data)
    }

    useEffect(() => {
        if (!config) return

        const connect = async () => {
            try {
                console.log('Trying to connect to hub...')
                await startConnectionForIngredients(config.API_URL)
                console.log('SignalR Connected!')
                startListenForIngredients(handleReceivedIngredients)
            } catch (error) {
                console.error('Error starting SignalR connection:', error)
            }
        }
        connect().catch(console.error)
        return () => {
            stopListenForIngredients()
        }
    }, [config])

    function handleReceivedIngredients(ingredients) {
        ingredients.sort((a, b) => a.stock - b.stock)
        setIngredients(ingredients)
    }

    return (
        <div className="p-4 sm:ml-64">
            <Modal show={modalIsOpen} size="md" onClose={() => closeModal()} popup>
                <IngredientsDelete closeModal={closeModal} id={id} />
            </Modal>

            <h1 className="text-4xl font-bold mb-10">{t('Ingredients sorted by stock')}</h1>

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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default IngredientsStock
