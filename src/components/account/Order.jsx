import MenuItem from './MenuItem.jsx'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Order({ order }) {
    const { t } = useTranslation()
    let paymentStatusClass = ''
    let paymentStatusText = ''

    if (order.isPaymentSuccess) {
        paymentStatusClass = 'bg-green-300 text-green-900'
        paymentStatusText = 'Paid'
    } else {
        paymentStatusClass = 'bg-yellow-300 text-yellow-900'
        paymentStatusText = 'Waiting for payment(s)'
    }

    return (
        <div>
            <div>
                <Link to={`/order/progress/${order.id}`} className={'font-bold text-xl underline'}>
                    Order #{order.orderNumber}
                </Link>
                <p className={`p-3 w-fit font-bold rounded ${paymentStatusClass}`}>{t(paymentStatusText)}</p>
            </div>
            <div>
                {order.menuItems &&
                    order.menuItems.map((menuItem) => {
                        return <MenuItem key={menuItem.id} menuItem={menuItem} />
                    })}
            </div>
        </div>
    )
}

export default Order
