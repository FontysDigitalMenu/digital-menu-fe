import React from 'react'
import { useTranslation } from 'react-i18next'

function ReservationConfirmation() {
    const { t } = useTranslation()

    return (
        <div>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="mt-6 mb-8 text-4xl font-extrabold text-gray-900 w-full text-center">{t('Reservation successful')}</h2>
                        <p className="text-lg text-gray-600 text-center">{t('Your reservation has been confirmed. You will receive an email shortly with the details.')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReservationConfirmation
