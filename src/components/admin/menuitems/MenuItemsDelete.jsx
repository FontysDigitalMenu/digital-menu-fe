import React, {useContext, useState} from 'react';
import ToastNotification from "../../notifications/ToastNotification.jsx";
import ConfigContext from '../../../provider/ConfigProvider.jsx'

function MenuItemsDelete(props) {
    const config = useContext(ConfigContext)

    async function deleteMenuItem(){
        const response = await fetch(`${config.API_URL}/api/v1/menuItem/${props.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        })

        if (response.status === 200) {
            return await response.json();
        }
    }

    function tryDeleteMenuItem(){
        deleteMenuItem().then((responseData)=>{
            if(responseData){
                ToastNotification('success', "MenuItem successfully deleted");
                props.closeModal()
            }
        })
            .catch((error) => {
                console.error(error)
                ToastNotification('error', "Failed to delete menu item");
            });
    }

    return (
        <div className="FormContainer" style={{display: "flex", flexDirection: "column"}}>
            <h2>Are you sure?</h2>
            <div>
                <button className="mr-1 text-blue-600" onClick={props.closeModal}>Cancel</button>
                <button className="text-red-600" onClick={tryDeleteMenuItem}>Delete</button>
            </div>
        </div>
    );
}

export default MenuItemsDelete;