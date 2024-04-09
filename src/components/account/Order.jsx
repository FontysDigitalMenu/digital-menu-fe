import MenuItem from './MenuItem.jsx'
import { Link } from 'react-router-dom'

function Order({ order }) {
    return (
        <div>
            <div>
                <Link to={`/order/progress/${order.id}`} className={'font-bold text-xl underline'}>
                    Order #{order.orderNumber}
                </Link>
                <p className={`p-3 w-fit font-bold rounded ${order.paymentStatus === 'Paid' ? 'bg-green-300 text-green-900' : 'bg-yellow-300 text-yellow-900'}`}>
                    {order.paymentStatus}
                    {order.paymentStatus === 'Pending' && ' payment'}
                </p>
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
