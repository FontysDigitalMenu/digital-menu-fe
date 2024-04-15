import MenuItem from './MenuItem.jsx'
import { Link } from 'react-router-dom'

function Order({ order }) {
    let paymentStatusClass = ''
    let paymentStatusText = ''

    switch (order.paymentStatus) {
        case 'Pending':
            paymentStatusClass = 'bg-yellow-300 text-yellow-900'
            paymentStatusText = 'Pending payment'
            break
        case 'Paid':
            paymentStatusClass = 'bg-green-300 text-green-900'
            paymentStatusText = 'Paid'
            break
        case 'Canceled':
            paymentStatusClass = 'bg-red-300 text-red-900'
            paymentStatusText = 'Payment canceled'
            break
        case 'Refund':
            paymentStatusClass = 'bg-purple-300 text-purple-900'
            paymentStatusText = 'Payment refunded'
            break
        case 'Expired':
            paymentStatusClass = 'bg-orange-300 text-orange-900'
            paymentStatusText = 'Payment expired'
            break
        default:
            paymentStatusClass = 'bg-gray-300 text-gray-900'
            paymentStatusText = 'Unknown'
            break
    }

    return (
        <div>
            <div>
                <Link to={`/order/progress/${order.id}`} className={'font-bold text-xl underline'}>
                    Order #{order.orderNumber}
                </Link>
                <p className={`p-3 w-fit font-bold rounded ${paymentStatusClass}`}>{paymentStatusText}</p>
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
