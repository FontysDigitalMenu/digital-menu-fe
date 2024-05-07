import {useContext, useEffect, useState} from "react";
import ConfigContext from "../../provider/ConfigProvider.jsx";
import {Link} from "react-router-dom";
import notification from "react-notifications/lib/Notification.js";
import ToastNotification from "../notifications/ToastNotification.jsx";
import IngredientsDelete from "../admin/ingredients/IngredientsDelete.jsx";
"use client";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function WaiterTables() {
    const [modalIsOpen, setIsOpen] = useState(false)
    const [tableId, setTableId] = useState(0)
    const [closeCount, setCloseCount] = useState(0)
    function openModal(id) {
        setTableId(id)
        setIsOpen(true)
    }
    function closeModal() {
        setIsOpen(false)
        setCloseCount((prev) => prev + 1)
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
        console.log(data)
        setTables(data)
    }

    function resetSession(){
        closeModal();
        fetch(`${config.API_URL}/api/v1/Table/ResetSession/${tableId}`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })
            .then((response) => {
                if (response.status === 204) {
                    ToastNotification('success', 'Reset table successfully');
                }
                else if (response.status === 404) {
                    ToastNotification('error', 'Table not found');
                }
                else{
                    ToastNotification('error', 'Failed to reset table');
                }
            })
            .catch(() => {
                ToastNotification('error', 'Failed to reset table');
            });
    }

    return (
        <div>
            <Modal show={modalIsOpen} size="md" onClose={() => closeModal()} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to reset this table?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => resetSession()}>
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => closeModal()}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {tables.map((table, index) => (
                <div key={index} className="border border-gray-500 px-2 py-1 rounded w-36 m-1">
                    <div className="flex justify-between ">
                    <div className="mr-4">{table.name}</div>
                        <button onClick={() => openModal(table.id)} className="flex items-center justify-end">
                            <span className="material-symbols-outlined text-red-500">
                                history
                            </span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default WaiterTables;