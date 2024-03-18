import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";

function TablesCreate() {
    const {id} = useParams();
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

    useEffect(() => {
        if (!config) return;
        fetchTable().then(r => r);
    }, [config]);

    function handleFormChange(e) {
        setTableForm(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    async function fetchTable() {
        const response = await fetch(`${config.API_URL}/api/v1/Table/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('accessToken'),
            },
            credentials: "include",
        });

        if (response.status === 200) {
            const data = await response.json();
            console.log(data)
            setTableForm(data);
        } else if (response.status === 401) {

        }
    }

    async function submitTable(e) {
        e.preventDefault();

        // if (alreadyRefreshed) return;

        const response = await fetch(`${config.API_URL}/api/v1/Table/${id}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(tableForm),
        });

        if (response.status === 204) {
            alert("Updated successfully");
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
                <input type="text" id="name" name="name" defaultValue={tableForm.name} required onChange={handleFormChange}/>
            </div>
            <button type="submit">Update</button>
        </form>
    );
}

export default TablesCreate;
