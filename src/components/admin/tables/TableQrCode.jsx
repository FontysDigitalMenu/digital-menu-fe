import { useRef } from 'react'
import { Link } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { ReactToPrint } from 'react-to-print'

function TableQrCode({ table, config, handleDelete }) {
    const printRef = useRef()

    return (
        <>
            <td>
                <Link className={'hover:underline'} to={`/admin/tables/${table.id}/edit`}>
                    {table.name}
                </Link>
            </td>
            <td>
                <div ref={printRef} className={'print:scale-[2] print:origin-top-left'} style={{ padding: '16px', maxWidth: 192, width: '100%' }}>
                    <div className={'hidden print:block mb-5'}>{table.name}</div>
                    <QRCode size={256} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} value={`${config.APP_URL}/table/${table.id}`} viewBox={`0 0 256 256`} />
                </div>
            </td>
            <td>
                <ReactToPrint
                    content={() => printRef.current}
                    trigger={() => {
                        return <button className="material-symbols-outlined border rounded text-4xl">print</button>
                    }}
                />
                <button className="material-symbols-outlined text-red-700 border rounded text-4xl" onClick={() => handleDelete(table.id)}>
                    delete
                </button>
            </td>
        </>
    )
}

export default TableQrCode
