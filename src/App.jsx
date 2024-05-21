import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home.jsx'
import Login from './components/authentication/Login.jsx'
import { useContext, useEffect, useState } from 'react'
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
import ReceiveOrder from './components/kitchen/ReceiveOrder.jsx'
import ReceiveOrderFood from './components/kitchen/ReceiveOrderFood.jsx'
import ReceiveOrderDrinks from './components/kitchen/ReceiveOrderDrinks.jsx'
import OrderProgress from './components/order/OrderProgress.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import MyOrders from './components/account/MyOrders.jsx'
import KitchenRoot from './components/KitchenRoot.jsx'
import MenuItems from './components/admin/menuitems/MenuItems.jsx'
import MenuItemsCreate from './components/admin/menuitems/MenuItemsCreate.jsx'
import SplitOrder from './components/order/SplitOrder.jsx'
import MenuItemsUpdate from './components/admin/menuitems/MenuItemsUpdate.jsx'
import Ingredients from './components/admin/ingredients/Ingredients.jsx'
import IngredientsCreate from './components/admin/ingredients/IngredientsCreate.jsx'
import IngredientsUpdate from './components/admin/ingredients/IngredientsUpdate.jsx'
import WaiterTables from './components/kitchen/WaiterTables.jsx'
import WaiterFood from './components/kitchen/WaiterFood.jsx'
import WaiterDrinks from './components/kitchen/WaiterDrinks.jsx'

function App() {
    const config = useContext(ConfigContext)
    const [isAuthenticated, setIsAuthenticated] = useState(true)

    useEffect(() => {
        if (!config) return

        if (config.DEVICE_ID !== null || config.TABLE_ID !== null) {
            localStorage.setItem('deviceId', config.DEVICE_ID)
            localStorage.setItem('tableSessionId', config.TABLE_ID)
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

                        <Route path="/order" element={<Root />}>
                            <Route path="progress/:orderId" element={<OrderProgress />} />
                            <Route path="split" element={<SplitOrder />} />
                        </Route>

                        {/*AUTH*/}
                        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

                        {/*ADMIN*/}
                        <Route path={'/admin'} element={isAuthenticated ? <AdminRoot setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login?intended=admin" />}>
                            <Route path={''} element={<Tables />} />
                            <Route path={'tables'} element={<Tables />} />
                            <Route path={'tables/create'} element={<TablesCreate />} />
                            <Route path={'tables/:id/edit'} element={<TablesEdit />} />
                            <Route path={'receiveOrder'} element={<ReceiveOrder />} />

                            <Route path={'menuItems'} element={<MenuItems />} />
                            <Route path={'menuItems/create'} element={<MenuItemsCreate />} />
                            <Route path={'menuItems/:id/edit'} element={<MenuItemsUpdate />} />

                            <Route path={'ingredients'} element={<Ingredients />} />
                            <Route path={'ingredients/create'} element={<IngredientsCreate />} />
                            <Route path={'ingredients/:id/edit'} element={<IngredientsUpdate />} />
                        </Route>

                        {/*KITCHEN*/}
                        <Route path={'/kitchen'} element={isAuthenticated ? <KitchenRoot setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login?intended=kitchen" />}>
                            <Route path={''} element={<Navigate to={'/kitchen/receive/order/food'} />} />
                            <Route path={'receive/order'} element={<ReceiveOrder />} />
                            <Route path={'receive/order/food'} element={<ReceiveOrderFood />} />
                            <Route path={'receive/order/drinks'} element={<ReceiveOrderDrinks />} />
                            <Route path={'waiter/food'} element={<WaiterFood />} />
                            <Route path={'waiter/drinks'} element={<WaiterDrinks />} />
                            <Route path={'waiter/tables'} element={<WaiterTables />} />
                        </Route>
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>

            <ToastContainer stacked position={'top-center'} />
        </>
    )
}

export default App
