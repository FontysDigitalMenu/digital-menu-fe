import React from 'react'
import { useNavigate } from 'react-router-dom'

function ButtonCancel({ text, navigateUrl }) {
    const navigate = useNavigate()

    return (
        <>
            <button type="button" onClick={() => navigate(navigateUrl)} className={'bg-white border border-gray-300 text-gray-900 rounded px-4 py-2'}>
                {text}
            </button>
        </>
    )
}

export default ButtonCancel
