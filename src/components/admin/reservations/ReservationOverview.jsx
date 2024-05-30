import { useContext, useState, useEffect } from 'react'
import ConfigContext from '../../../provider/ConfigProvider'
import { useTranslation } from 'react-i18next'
import { Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import ToastNotification from '../../notifications/ToastNotification.jsx'

function ReservationOverview() {
    const { t } = useTranslation()
    const [selectedDate, setSelectedDate] = useState(null)
    const [reservations, setReservations] = useState([])
    const config = useContext(ConfigContext)
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
        if (!selectedDate) return
        fetchReservations().then((r) => r)
    }, [selectedDate, config])

    async function fetchReservations() {
        const response = await fetch(`${config.API_URL}/api/v1/Reservation/${selectedDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })

        const data = await response.json()
        setReservations(data)
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
                    fetchReservations().then((r) => r)
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

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value)
    }

    const formatTime = (hours, minutes) => {
        const formattedHours = String(hours).padStart(2, '0')
        const formattedMinutes = String(minutes).padStart(2, '0')
        return `${formattedHours}:${formattedMinutes}`
    }

    return (
        <div className="p-4 sm:ml-64">
            <div className="w-full h-full">
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

                <div className="mb-10">
                    <h1 className="text-4xl font-bold">Reservations</h1>
                </div>
                <div>
                    <label className="block mb-2 text-lg font-medium text-gray-900">{t('Choose a date')}</label>
                    <input type="date" className="w-full md:w-96 mb-10" onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} />

                    {selectedDate && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                            {reservations.map((reservation, index) => {
                                const reservationDateTime = new Date(reservation.reservationDateTime)
                                const hours = reservationDateTime.getHours()
                                const minutes = reservationDateTime.getMinutes()

                                const newDateTime = new Date(reservationDateTime.getTime() + 2.5 * 60 * 60 * 1000)
                                const newHours = newDateTime.getHours()
                                const newMinutes = newDateTime.getMinutes()

                                const originalTime = formatTime(hours, minutes)
                                const newTime = formatTime(newHours, newMinutes)

                                return (
                                    <div key={index} className="rounded-lg bg-gray-200 p-2">
                                        <p className="font-medium text-lg mb-4 w-full">{reservation.email}</p>
                                        <div className="w-full flex justify-between">
                                            <div>
                                                <p className="text-lg">{reservation.tableName}</p>
                                                <p className="text-lg">
                                                    {originalTime} - {newTime}
                                                </p>
                                            </div>
                                            <div>
                                                <button onClick={() => openModal(reservation.id)} className="flex items-center justify-end mr-4">
                                                    <span className="material-symbols-outlined text-red-500 text-4xl">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ReservationOverview
