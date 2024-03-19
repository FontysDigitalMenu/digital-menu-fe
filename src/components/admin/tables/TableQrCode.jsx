import React, {useRef} from 'react';
import {Link} from "react-router-dom";
import QRCode from "react-qr-code";
import {ReactToPrint} from "react-to-print";

function TableQrCode({table, config, handleDelete}) {
    const printRef = useRef();

    return (
        <>
            <td>
                <Link className={"hover:underline"}
                      to={`/admin/tables/${table.id}/edit`}>{table.name}</Link>
            </td>
            <td>
                <div ref={printRef} className={"print:scale-[2] print:origin-top-left"} style={{padding: '16px', maxWidth: 192, width: "100%"}}>
                    <div className={"hidden print:block mb-5"}>{table.name}</div>
                    <QRCode
                        size={256}
                        style={{height: "auto", maxWidth: "100%", width: "100%"}}
                        value={`${config.APP_URL}/table/${table.id}`}
                        viewBox={`0 0 256 256`}
                    />
                </div>
                {/*<img src={`data:image/png;base64,${table.qrCode}`} alt="qr code" loading={"lazy"}*/}
                {/*     width={200}/>*/}
            </td>
            <td>
                <ReactToPrint
                    content={() => printRef.current}
                    trigger={() => {
                        return <button>print</button>;
                    }}
                />
                <button onClick={() => handleDelete(table.id)}>verwijder</button>
            </td>
        </>
    );
}

export default TableQrCode;