import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

function TablesCreate() {
    const navigate = useNavigate();
    const [config, setConfig] = useState("");
    const [tableForm, setTableForm] = useState({
        name: "",
    })

    useEffect(() => {
        async function getConfig() {
            setConfig(await fetch('/config.json').then((res) => res.json()));
        }

        getConfig().then(r => r);
    }, []);

    function handleFormChange(e) {
        setTableForm(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    async function submitTable(e) {
        e.preventDefault();

        // if (alreadyRefreshed) return;

        const response = await fetch(`${config.API_URL}/api/v1/Table`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(tableForm),
        });

        if (response.status === 204) {
            alert("Created successfully");
            return navigate('/admin/tables')
        } else if (response.status === 401) {
            // await auth.refresh();
            // submitTable();
        }
    }

    return (
        <form onSubmit={submitTable}>
            <div>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required onChange={handleFormChange}/>
            </div>
            <button type="submit">Create</button>
        </form>
    );
}

export default TablesCreate;
