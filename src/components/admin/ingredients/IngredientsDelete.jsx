import React, { useContext, useState } from 'react'
import ToastNotification from '../../notifications/ToastNotification.jsx'
import ConfigContext from '../../../provider/ConfigProvider.jsx'
import { useTranslation } from 'react-i18next'

function IngredientsDelete(props) {
    const config = useContext(ConfigContext)
    const { t } = useTranslation()

    async function tryDeleteIngredient() {
        try {
            const response = await fetch(`${config.API_URL}/api/v1/ingredients/${props.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                },
            })

            if (response.status === 204) {
                ToastNotification('success', t('Ingredient successfully deleted'))
                props.closeModal()
            } else {
                ToastNotification('error', t('Failed to delete ingredient'))
            }
        } catch (error) {
            console.error(error)
            ToastNotification('error', t('Failed to delete ingredient'))
        }
    }

    return (
        <div className="relative p-4 py-10 w-full text-center max-w-md h-full md:h-auto bg-white rounded-lg">
            <button onClick={() => props.closeModal()} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="deleteModal">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">Close modal</span>
            </button>
            <svg className="text-gray-400 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            <p className="mb-4 text-gray-500">{t('Are you sure you want to delete this ingredient?')}</p>
            <div className="flex justify-center items-center space-x-4">
                <button
                    onClick={() => props.closeModal()}
                    data-modal-toggle="deleteModal"
                    type="button"
                    className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10"
                >
                    {t('No, cancel')}
                </button>
                <button onClick={() => tryDeleteIngredient()} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300">
                    {t('Yes, I am sure')}
                </button>
            </div>
        </div>
    )
}

export default IngredientsDelete
