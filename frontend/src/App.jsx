  import React from "react"
  import { Routes, Route, useLocation } from "react-router-dom"
  import { Toaster } from "react-hot-toast"

  import Navbar from "./components/Navbar"
  import Footer from "./components/Footer"
  import Login from "./components/Login"

  import Home from "./pages/Home"
  import Products from "./pages/Products"
  import ProductDetails from "./pages/Productdetails"
  import BillingHistory from './pages/BillingHistory'
  import Cart from "./pages/Cart"
  
  
  import MyRentals from "./pages/MyRentals"
  import MaintenanceRequest from "./pages/Maintenance"

  import Layout from "./pages/admin/Layout"
  import Dashboard from "./pages/admin/DashBoard"
  import AdminRoute from "./components/AdminRoute"

  import AddProduct from "./pages/vendor/AddProduct"
  import ManageProduct from "./pages/vendor/ManageProduct"
  import ManageOrder from "./pages/vendor/ManageOrder"
  import Logistics from "./pages/vendor/Logistics"
  import Maintenance from "./pages/vendor/Maintenance"
  

  import UserManagement from "./pages/admin/UserManagement"
  import Analytics from "./pages/admin/Analytics"
  import ServiceAreas from "./pages/admin/ServiceAreas"
  import DisputeCenter from "./pages/admin/DisputeCenter"
  import AdminMonitor from "./pages/admin/AdminMonitor"
  import RentalManagement from "./pages/admin/RentalManagement"

  import { useAppContext } from "./components/context/AppContext"

  const App = () => {

    const { showLogin } = useAppContext()

    const location = useLocation()

    const isDashboardPath =
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/vendor")

    return (
      <>
        <Toaster />

        {showLogin && <Login />}

        {!isDashboardPath && <Navbar />}

        <Routes>

          {/* USER */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/my-rentals" element={<MyRentals />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/billing-history" element={<BillingHistory />}/>
          <Route path="/maintenance-request" element={<MaintenanceRequest />} />
          

          {/* ADMIN */}
          <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="service-areas" element={<ServiceAreas />} />
            <Route path="disputes" element={<DisputeCenter />} />
            <Route path="monitor" element={<AdminMonitor />} />
            <Route path="rentals" element={<RentalManagement />} />
          </Route>

          {/* VENDOR */}
          <Route path="/vendor" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="manage-products" element={<ManageProduct />} />
            <Route path="manage-orders" element={<ManageOrder />} />
            <Route path="logistics" element={<Logistics />} />
            <Route path="maintenance" element={<Maintenance />} />
          </Route>

        </Routes>

        {!isDashboardPath && <Footer />}
      </>
    )
  }

  export default App