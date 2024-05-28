import React, { useContext, useState, useEffect } from 'react'
import ConfigContext from '../../provider/ConfigProvider.jsx'
import { useTranslation } from 'react-i18next'
import ToastNotification from '../notifications/ToastNotification.jsx'
import { useNavigate } from 'react-router-dom'
import SettingsContext from '../../provider/SettingsProvider.jsx'

function Reservation() {
    const { t } = useTranslation()
    const setting = useContext(SettingsContext)
    const navigate = useNavigate()
    const config = useContext(ConfigContext)
    const [selectedDate, setSelectedDate] = useState(null)
    const [timeSlots, setTimeSlots] = useState([])
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (config) {
            if (selectedDate) {
                const fetchTimeSlots = async () => {
                    const response = await fetch(`${config.API_URL}/api/v1/reservation/availableTimes/${selectedDate}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept-Language': localStorage.getItem('i18nextLng') || 'en',
                        },
                    })

                    if (response.status === 200) {
                        const data = await response.json()
                        const timeSlotsResponse = data.map((slot) => ({
                            startTime: slot.startDateTime.slice(11, 16),
                            endTime: slot.endDateTime.slice(11, 16),
                        }))
                        setTimeSlots(timeSlotsResponse)
                    } else {
                        ToastNotification('error', "Couldn't retrieve the menu item")
                    }
                }

                fetchTimeSlots().then((r) => r)
            }
        }
    }, [selectedDate, config])

    const handleSlotSelect = (index) => {
        setSelectedSlot(index)
    }

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value)
        setSelectedSlot(null)
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handleReservation = async () => {
        try {
            const reservationDateTime = selectedDate + 'T' + timeSlots[selectedSlot].startTime + ':00.000Z'

            const reservationData = {
                email: email,
                reservationDateTime: reservationDateTime,
                tableId: '493FAF89-7344-403C-8D89-C9DF5BDFCB0F',
            }

            const response = await fetch(`${config.API_URL}/api/v1/reservation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': localStorage.getItem('i18nextLng') || 'en',
                },
                body: JSON.stringify(reservationData),
            })

            if (response.status === 201) {
                ToastNotification('success', t('Reservation was placed successfully'))

                return navigate('/reservation/confirmation')
            } else {
                ToastNotification('error', t('Failed to make a reservation'))
            }
        } catch (error) {
            console.error('Error occurred:', error)
            ToastNotification('error', t('Error occurred while making a reservation'))
        }
    }

    return (
        <div className="p-2 md:p-4">
            <h1 className="text-4xl mb-10 font-bold">{t('Reservation')}</h1>

            <label className="block mb-2 text-lg font-medium text-gray-900">{t('Choose a date')}</label>
            <input type="date" className="w-full mb-10" onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} />

            {selectedDate && (
                <>
                    <label className="block mb-2 text-lg font-medium text-gray-900">{t('Choose a time')}</label>
                    <div className="mb-10">
                        {timeSlots.map((slot, index) => (
                            <div key={index} className={`${selectedSlot === index ? `bg-[${setting.primaryColor}] text-white` : 'bg-white'} border border-black py-4 rounded-lg mb-2 cursor-pointer`} onClick={() => handleSlotSelect(index)}>
                                <p className="flex w-full justify-center text-lg">{`${slot.startTime} - ${slot.endTime}`}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mb-10">
                        <label className="block mb-2 text-lg font-medium text-gray-900">{t('Email')}</label>
                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder={t('Email')} onChange={handleEmailChange} required />
                    </div>

                    <button className={`flex items-center py-2 h-full text-white rounded-2xl italic mb-3 justify-center w-full bg-[${setting.primaryColor}] hover:bg-[${setting.secondaryColor}]`} onClick={handleReservation}>
                        {t('Reserve')}
                    </button>
                </>
            )}
        </div>
    )
}

export default Reservation
