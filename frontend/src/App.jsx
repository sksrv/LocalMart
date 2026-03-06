import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import RoleRoute from "./components/RoleRoute.jsx";

import Home from "./pages/Home.jsx";
import CreateStore from "./pages/seller/CreateStore.jsx";
import SellerDashboard from "./pages/seller/SellerDashboard.jsx";
import AddProduct from "./pages/seller/AddProduct.jsx";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import EditProduct from "./pages/seller/EditProduct.jsx";
import CartPage from "./pages/user/CartPage.jsx";
import Checkout from "./pages/user/Checkout.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import MyOrders from "./pages/user/MyOrders.jsx";
import SellerOrders from "./pages/seller/SellerOrders.jsx";
import MyProfile from "./pages/MyProfile.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route  path="/my-orders" element={ <RoleRoute role="buyer">  <MyOrders />  </RoleRoute>} />
        <Route  path="/seller-orders" element={ <RoleRoute role="seller"> <SellerOrders />  </RoleRoute>  } />
        <Route path="/profile" element={<MyProfile />} />
        
        {/* Buyer Only */}
        <Route
          path="/create-store"
          element={
            <RoleRoute role="buyer">
              <CreateStore />
            </RoleRoute>
          }
        />

        {/* Seller Only */}
        <Route
          path="/dashboard"
          element={
            <RoleRoute role="seller">
              <SellerDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/add-product"
          element={
            <RoleRoute role="seller">
              <AddProduct />
            </RoleRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}