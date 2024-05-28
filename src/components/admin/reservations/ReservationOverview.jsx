import { useContext, useState, useEffect } from 'react'
import ConfigContext from '../../../provider/ConfigProvider';
import { useTranslation } from 'react-i18next'

function ReservationOverview() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [reservations, setReservations] = useState([]);
  const config = useContext(ConfigContext)
  
  useEffect(() => {
    if (!config) return
    if (!selectedDate) return
    fetchReservations().then((r) => r)
  }, [selectedDate, config])

  async function fetchReservations() {
    const response = await fetch(`${config.API_URL}/api/v1/Reservation/${selectedDate}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      }
    })

    const data = await response.json()
    setReservations(data)
    console.log(data)
  }

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value)
    setSelectedSlot(null)
}

  return (
    <div className='p-4 sm:ml-64'>
      <div className='w-full h-full'>
        <div>
          <h1 className='font-bold'>Reservations</h1>
        </div>
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-900">{t('Choose a date')}</label>
          <input type="date" className="w-full mb-10" onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} />

          { selectedDate && (
            <div>
              { reservations.map((reservation, index) => (
                <div key={index}>
                  <p>{reservation.email}</p>
                </div>
              ))}
            </div> 
          )}
        </div>
      </div>
    </div>
  )
}

export default ReservationOverview
