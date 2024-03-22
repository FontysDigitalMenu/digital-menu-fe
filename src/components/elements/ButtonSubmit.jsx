import React from 'react';

function ButtonSubmit({text}) {
    return (
        <button type="submit" className={"bg-red-500 border border-red-500 text-white rounded px-4 py-2"}>{text}</button>
    );
}

export default ButtonSubmit;