import { useRef } from 'react'
import { Link } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { ReactToPrint } from 'react-to-print'
import { useTranslation } from 'react-i18next'

function TableQrCode({ table, config, openModal }) {
    const { t } = useTranslation()
    const printRef = useRef()

    return (
        <>
            <td className="px-6 py-4">
                <Link className={'hover:underline'} to={`/admin/tables/${table.id}/edit`}>
                    {table.name}
                </Link>
            </td>
            <td className="px-6 py-4">
                <div ref={printRef} className={'print:scale-[2] print:origin-top-left'} style={{ padding: '16px', maxWidth: 192, width: '100%' }}>
                    <div className={'hidden print:block mb-5'}>{table.name}</div>
                    <QRCode size={256} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} value={`${config.APP_URL}/table/${table.id}`} viewBox={`0 0 256 256`} />
                </div>
            </td>
            <td className="px-6 py-4">
                <div className={'flex items-center'}>
                    <ReactToPrint
                        content={() => printRef.current}
                        trigger={() => {
                            return <button className="material-symbols-outlined border rounded text-4xl">print</button>
                        }}
                    />
                    <Link to={`/admin/tables/${table.id}/edit`} className="m-1 font-medium text-blue-600 hover:underline">
                        {t('Edit')}
                    </Link>
                    <button
                        onClick={() => {
                            openModal(table.id)
                        }}
                        className="text-red-600"
                    >
                        {t('Delete')}
                    </button>
                </div>
            </td>
        </>
    )
}

export default TableQrCode
