import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ToastNotification from '../../notifications/ToastNotification.jsx'
import ButtonCancel from '../../elements/ButtonCancel.jsx'
import ButtonSubmit from '../../elements/ButtonSubmit.jsx'
import ConfigContext from '../../../provider/ConfigProvider.jsx'
import { useTranslation } from 'react-i18next'
import { Checkbox } from 'flowbite-react'

function TablesEdit() {
    const { id } = useParams()
    const config = useContext(ConfigContext)
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [tableForm, setTableForm] = useState({
        name: '',
        isReservable: false,
    })

    useEffect(() => {
        if (!config) return
        fetchTable().then((r) => r)
    }, [config])

    function handleFormChange(e) {
        if (e.target.name === 'isReservable') {
            setTableForm((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.checked,
            }))
        } else {
            setTableForm((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
        console.log(tableForm)
    }

    async function fetchTable() {
        const response = await fetch(`${config.API_URL}/api/v1/Table/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
            credentials: 'include',
        })

        if (response.status === 200) {
            const data = await response.json()
            setTableForm(data)
        } else if (response.status === 401) {
            // await auth.refresh();
            // fetchTable();
        }
    }

    async function submitTable(e) {
        e.preventDefault()

        // if (alreadyRefreshed) return;

        const response = await fetch(`${config.API_URL}/api/v1/Table/${id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(tableForm),
        })

        if (response.status === 204) {
            ToastNotification('success', t('Updated successfully'))
            return navigate('/admin/tables')
        } else if (response.status === 401) {
            // await auth.refresh();
            // submitTable();
        }
    }

    return (
        <>
            <div className="p-4 sm:ml-64">
                <form onSubmit={submitTable} className={'flex flex-col gap-y-2'}>
                    <div>
                        <label htmlFor="name">{t('Name')}</label>
                        <input type="text" id="name" name="name" defaultValue={tableForm.name} required onChange={handleFormChange} className={'input'} />
                    </div>
                    <div className={'flex gap-x-2 items-center'}>
                        <label htmlFor="isReservable">{t('Is reservable')}</label>
                        <input type="checkbox" id="isReservable" name="isReservable" checked={tableForm.isReservable} onChange={handleFormChange} />
                    </div>
                    <br />
                    <div className={'flex gap-x-1'}>
                        <ButtonCancel text={t('Cancel')} navigateUrl={'/admin/tables'}></ButtonCancel>
                        <ButtonSubmit text={t('Update')}></ButtonSubmit>
                    </div>
                </form>
            </div>
        </>
    )
}

export default TablesEdit
