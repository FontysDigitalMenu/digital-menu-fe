import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ButtonSubmit from '../../elements/ButtonSubmit.jsx'
import ToastNotification from '../../notifications/ToastNotification.jsx'
import ButtonCancel from '../../elements/ButtonCancel.jsx'
import ConfigContext from '../../../provider/ConfigProvider.jsx'
import AuthService from '../../../services/AuthService.jsx'

function TablesCreate() {
    const navigate = useNavigate()
    const config = useContext(ConfigContext)
    const [tableForm, setTableForm] = useState({
        name: '',
    })

    function handleFormChange(e) {
        setTableForm((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    async function submitTable(e) {
        e.preventDefault()

        const response = await fetch(`${config.API_URL}/api/v1/Table`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(tableForm),
        })

        if (response.status === 201) {
            ToastNotification('success', 'Created successfully')

            return navigate('/admin/tables')
        } else if (response.status === 401) {
            await AuthService.refreshAccessToken()
            await submitTable(e)
        }
    }

    return (
        <>
            <div className="p-4 sm:ml-64">
                <form onSubmit={submitTable} className={'flex flex-col gap-y-2'}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" required onChange={handleFormChange} className={'input'} />
                    </div>
                    <div className={'flex gap-x-1'}>
                        <ButtonCancel text={'Cancel'} navigateUrl={'/admin/tables'} />
                        <ButtonSubmit text={'Create'} />
                    </div>
                </form>
            </div>
        </>
    )
}

export default TablesCreate
