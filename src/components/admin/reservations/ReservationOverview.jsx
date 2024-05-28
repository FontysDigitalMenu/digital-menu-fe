import { useContext, useState, useEffect } from 'react'
import ConfigContext from '../../../provider/ConfigProvider'
import { useTranslation } from 'react-i18next'

function ReservationOverview() {
    const { t } = useTranslation()
    const [selectedDate, setSelectedDate] = useState(null)
    const [reservations, setReservations] = useState([])
    const config = useContext(ConfigContext)

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
        console.log(data)
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
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">Reservations</h1>
                </div>
                <div>
                    <label className="block mb-2 text-lg font-medium text-gray-900">{t('Choose a date')}</label>
                    <input type="date" className="w-96 mb-10" onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} />

                    {selectedDate && (
                        <div className="grid grid-cols-4 gap-2">
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
                                        <p className="font-medium text-lg mb-4">{reservation.email}</p>
                                        <p className="text-lg">{reservation.tableName}</p>
                                        <p className="text-lg">
                                            {originalTime} - {newTime}
                                        </p>
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
