import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SettingsContext from '../../provider/SettingsProvider.jsx'
import { useTranslation } from 'react-i18next'
import ConfigContext from '../../provider/ConfigProvider.jsx'
import { Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import ToastNotification from '../notifications/ToastNotification.jsx'

function CancelReservation(props) {
    const { id } = useParams()
    const setting = useContext(SettingsContext)
    const navigate = useNavigate()
    const { t } = useTranslation()
    const config = useContext(ConfigContext)
    const [reservation, setReservation] = useState(null)
    const [reservationId, setReservationId] = useState(0)
    const [modalIsOpen, setIsOpen] = useState(false)

    function openModal(id) {
        setReservationId(id)
        setIsOpen(true)
    }

    function closeModal() {
        setIsOpen(false)
    }

    useEffect(() => {
        if (!config) return
        fetchReservation().then((r) => r)
    }, [config])

    async function fetchReservation() {
        const response = await fetch(`${config.API_URL}/api/v1/reservation/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
            credentials: 'include',
        })

        const data = await response.json()
        setReservation(data)
    }

    function deleteReservation() {
        closeModal()
        fetch(`${config.API_URL}/api/v1/reservation/${reservationId}`, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })
            .then((response) => {
                if (response.status === 204) {
                    ToastNotification('success', t('Reservation has been cancelled successfully'))
                    navigate('/reservation')
                } else if (response.status === 404) {
                    ToastNotification('error', t('Reservation not found'))
                } else {
                    ToastNotification('error', t('Failed to cancel reservation'))
                }
            })
            .catch(() => {
                ToastNotification('error', t('Failed to cancel reservation'))
            })
    }

    return (
        <div>
            <Modal show={modalIsOpen} size="md" onClose={() => closeModal()} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 " />
                        <h3 className="mb-5 text-lg font-normal text-gray-500">{t('Are you sure you want to cancel this reservation?')}</h3>
                        <div className="flex justify-center gap-4 ">
                            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors" onClick={deleteReservation}>
                                {t("Yes, I'm sure")}
                            </button>
                            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors" onClick={closeModal}>
                                {t('No, cancel')}
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {reservation ? (
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
                    <div className="w-full max-w-md space-y-8">
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="text-4xl mt-8 mb-10 font-bold text-center">{t('Cancel reservation')}</h1>
                            <p className="text-lg text-gray-600 text-center mb-12">{t('Are you sure you want to cancel the following reservation?')}</p>

                            <div>
                                <p className="text-3xl text-[#27AE60] mb-4 font-bold">{reservation.reservationId}</p>
                                <p className="text-3xl mb-10 font-bold">{reservation.tableName}</p>
                            </div>

                            <button className={`flex items-center py-2 h-full text-white rounded-2xl italic mb-3 justify-center w-full bg-[${setting.primaryColor}] hover:bg-[${setting.secondaryColor}]`} onClick={() => openModal(id)}>
                                {t('Cancel reservation')}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
                    <h1 className="text-4xl mt-8 mb-10 font-bold text-center">{t('No Reservation Found')}</h1>
                    <p className="text-lg text-gray-600 text-center mb-12">{t('There is no reservation to cancel at the moment.')}</p>
                </div>
            )}
        </div>
    )
}

export default CancelReservation
