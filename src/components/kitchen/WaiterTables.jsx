import { Button, Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

import { useContext, useEffect, useState } from 'react'
import ConfigContext from '../../provider/ConfigProvider.jsx'
import ToastNotification from '../notifications/ToastNotification.jsx'

function WaiterTables() {
    const [modalIsOpen, setIsOpen] = useState(false)
    const [tableId, setTableId] = useState(0)
    function openModal(id) {
        setTableId(id)
        setIsOpen(true)
    }
    function closeModal() {
        setIsOpen(false)
    }
    const config = useContext(ConfigContext)
    const [tables, setTables] = useState([])

    useEffect(() => {
        if (!config) return
        fetchTables().then((r) => r)
    }, [config])

    async function fetchTables() {
        const response = await fetch(`${config.API_URL}/api/v1/Table`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })

        const data = await response.json()
        setTables(data)
    }

    function resetSession() {
        closeModal()
        fetch(`${config.API_URL}/api/v1/Table/ResetSession/${tableId}`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })
            .then((response) => {
                if (response.status === 204) {
                    ToastNotification('success', 'Reset table successfully')
                } else if (response.status === 404) {
                    ToastNotification('error', 'Table not found')
                } else {
                    ToastNotification('error', 'Failed to reset table')
                }
            })
            .catch(() => {
                ToastNotification('error', 'Failed to reset table')
            })
    }

    return (
        <div>
            <Modal show={modalIsOpen} size="md" onClose={() => closeModal()} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 " />
                        <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to reset this table?</h3>
                        <div className="flex justify-center gap-4 ">
                            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors" onClick={resetSession}>
                                {"Yes, I'm sure"}
                            </button>
                            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors" onClick={closeModal}>
                                No, cancel
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {tables.map((table, index) => (
                <div key={index} className="border border-gray-500 px-2 py-1 rounded w-36 m-1">
                    <div className="flex justify-between ">
                        <div className="mr-4">{table.name}</div>
                        <button onClick={() => openModal(table.id)} className="flex items-center justify-end">
                            <span className="material-symbols-outlined text-red-500">history</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default WaiterTables
