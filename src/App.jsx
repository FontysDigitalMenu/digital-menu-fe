import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home.jsx'
import Login from './components/authentication/Login.jsx'
import Orders from './components/staff/Orders.jsx'
import { useContext, useEffect, useState } from 'react'
import Dashboard from './components/admin/Dashboard.jsx'
import AuthService from './services/AuthService.jsx'
import Tables from './components/admin/tables/Tables'
import ScannedTable from './components/tables/ScannedTable'
import ConfigContext from './provider/ConfigProvider.jsx'
import TablesCreate from './components/admin/tables/TablesCreate.jsx'
import TablesEdit from './components/admin/tables/TablesEdit.jsx'
import { ToastContainer } from 'react-toastify'
import CartOverview from './components/cart/CartOverview.jsx'
import { v4 } from 'uuid'
import MenuItemDetails from './components/MenuItemDetails.jsx'
import CartItemEdit from './components/CartItemEdit.jsx'
import AdminRoot from './components/AdminRoot.jsx'
import Root from './components/Root.jsx'
import ReceiveOrder from './ReceiveOrder.jsx'
import ReceiveOrderFood from './ReceiveOrderFood.jsx'
import ReceiveOrderDrinks from './ReceiveOrderDrinks.jsx'
import OrderProgress from './components/order/OrderProgress.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import MyOrders from './components/account/MyOrders.jsx'
import KitchenRoot from './components/KitchenRoot.jsx'

function App() {
    const config = useContext(ConfigContext)
    const [isAuthenticated, setIsAuthenticated] = useState(true)

    useEffect(() => {
        if (!config) return

        if (config.DEVICE_ID !== null || config.TABLE_ID !== null) {
            localStorage.setItem('deviceId', config.DEVICE_ID)
            localStorage.setItem('tableId', config.TABLE_ID)
            return
        }

        if (!localStorage.getItem('deviceId')) {
            const newDeviceId = v4()
            localStorage.setItem('deviceId', newDeviceId)
        }
    }, [config])

    useEffect(() => {
        if (config) {
            AuthService.checkAuthentication(config).then((isAuthenticated) => setIsAuthenticated(isAuthenticated))

            if (!isAuthenticated) {
                AuthService.refreshAccessToken(config).then((r) => r)
            }
        }
    }, [config])

    return (
        <>
            <BrowserRouter>
                <ScrollToTop>
                    <Routes>
                        <Route path="/" element={<Root />}>
                            <Route path="" element={<Home />} />
                            <Route path="menu/:id" element={<MenuItemDetails />} />
                            <Route path="cartItem/edit/:id" element={<CartItemEdit />} />
                            <Route path="cart" element={<CartOverview />} />
                            <Route path="table/:id" element={<ScannedTable />} />
                            <Route path="account/orders" element={<MyOrders />} />
                        </Route>

                        <Route path="/staff">
                            <Route path="orders" element={<Orders />} />
                        </Route>

                        <Route path="/order" element={<Root />}>
                            <Route path="progress/:orderId" element={<OrderProgress />} />
                        </Route>

                        {/*AUTH*/}
                        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

                        {/*ADMIN*/}
                        <Route path={'/admin'} element={isAuthenticated ? <AdminRoot setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}>
                            <Route path={''} element={<Dashboard />} />
                            <Route path={'tables'} element={<Tables />} />
                            <Route path={'tables/create'} element={<TablesCreate />} />
                            <Route path={'tables/:id/edit'} element={<TablesEdit />} />
                            <Route path={'receiveOrder'} element={<ReceiveOrder />} />
                        </Route>

                        {/*KITCHEN*/}
                        <Route path={'/kitchen'} element={isAuthenticated ? <KitchenRoot setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}>
                            <Route path={'receive/order'} element={<ReceiveOrder />} />
                            <Route path={'receive/order/food'} element={<ReceiveOrderFood />} />
                            <Route path={'receive/order/drinks'} element={<ReceiveOrderDrinks />} />
                        </Route>
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>

            <ToastContainer stacked position={'top-center'} />
        </>
    )
}

export default App
