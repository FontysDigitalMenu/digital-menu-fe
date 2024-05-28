import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import SettingsContext from '../../provider/SettingsProvider.jsx'

function ButtonCreateNew({ text, navigateUrl }) {
    const setting = useContext(SettingsContext)
    const navigate = useNavigate()

    return (
        <>
            <button type="button" onClick={() => navigate(navigateUrl)} className={` bg-[${setting.primaryColor}] hover:bg-[${setting.secondaryColor}] border border-[${setting.primaryColor}] text-white rounded px-4 py-2`}>
                {text}
            </button>
        </>
    )
}

export default ButtonCreateNew
