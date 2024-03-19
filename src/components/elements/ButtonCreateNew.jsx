import React from 'react';
import {useNavigate} from "react-router-dom";

function ButtonCreateNew({text, navigateUrl}) {
    const navigate = useNavigate();

    return (
        <>
            <button type="button" onClick={() => navigate(navigateUrl)}
                    className={"bg-red-500 border border-red-500 text-white rounded px-4 py-2"}>
                {text}
            </button>
        </>
    );
}

export default ButtonCreateNew;