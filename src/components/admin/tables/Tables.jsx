import { useContext, useEffect, useState } from 'react'
import Spinner from '../../elements/Spinner.jsx'
import TableRow from './TableQrCode.jsx'
import ButtonCreateNew from '../../elements/ButtonCreateNew.jsx'
import ConfigContext from '../../../provider/ConfigProvider.jsx'
import { useTranslation } from 'react-i18next'
import { Modal } from 'flowbite-react'
import Delete from '../Delete.jsx'
import SettingsContext from '../../../provider/SettingsProvider.jsx'

function Tables() {
    const config = useContext(ConfigContext)
    const setting = useContext(SettingsContext)
    const { t } = useTranslation()
    const [tables, setTables] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [id, setId] = useState(0)
    const [modalIsOpen, setIsOpen] = useState(false)
    const [closeCount, setCloseCount] = useState(0)

    useEffect(() => {
        if (!config) return
        fetchQrCode().then((r) => r)
    }, [config])

    function openModal(id) {
        setId(id)
        setIsOpen(true)
    }

    function closeModal() {
        setIsOpen(false)
        setCloseCount((prev) => prev + 1)
    }

    async function fetchQrCode() {
        setIsLoading(true)
        const response = await fetch(`${config.API_URL}/api/v1/Table`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })
        setIsLoading(false)

        const data = await response.json()
        setTables(data)
    }

    return (
        <>
            <div className="p-4 sm:ml-64">
                <Modal show={modalIsOpen} size="md" onClose={() => closeModal()} popup>
                    <Delete url={`${config?.API_URL}/api/v1/table/${id}`} onDeletionSuccess={() => fetchQrCode()} closeModal={closeModal} />
                </Modal>

                <ButtonCreateNew text={t('Create new')} navigateUrl={'/admin/tables/create'} />
                <h1>{t('Tables')}</h1>
                {isLoading && <Spinner />}

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    {t('name')}
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    {t('qrcode')}
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    {t('actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map((table) => {
                                return (
                                    <tr key={table.id}>
                                        <TableRow table={table} config={config} openModal={openModal} />
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Tables
