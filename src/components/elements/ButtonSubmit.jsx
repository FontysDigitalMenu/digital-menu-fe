import React, { useContext } from 'react'
import SettingsContext from '../../provider/SettingsProvider.jsx'

function ButtonSubmit({ text }) {
    const setting = useContext(SettingsContext)

    return (
        <button type="submit" className={`!bg-[${setting.primaryColor}] hover:!bg-[${setting.secondaryColor}] border border-[${setting.primaryColor}] text-white rounded px-4 py-2`}>
            {text}
        </button>
    )
}

export default ButtonSubmit
