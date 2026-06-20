import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PATHS } from '../constants/paths';
import { Box, CircularProgress } from '@mui/material';

const Home = lazy(() => import('../pages/Home'));
const Products = lazy(() => import('../pages/Products'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Profile = lazy(() => import('../pages/Profile'));
const Orders = lazy(() => import('../pages/Orders'));
const Services = lazy(() => import('./landing/Services'));
const ServiceBooking = lazy(() => import('../pages/ServiceBooking'));
const FAQ = lazy(() => import('../pages/FAQ'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('../pages/admin/Products'));
const AdminOrders = lazy(() => import('../pages/admin/Orders'));
const AdminUsers = lazy(() => import('../pages/admin/Users'));
const AdminServices = lazy(() => import('../pages/admin/Services'));
const AdminCategories = lazy(() => import('../pages/admin/Categories'));


const AppRoutes = () => {
  return (
      <Routes>
        <Route path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.PRODUCTS} element={<Products />} />
        <Route path={PATHS.PRODUCT_DETAILS} element={<ProductDetails />} />
        <Route path={PATHS.ABOUT} element={<About />} />
        <Route path={PATHS.CONTACT} element={<Contact />} />
        <Route path={PATHS.CART} element={<Cart />} />
        <Route path={PATHS.CHECKOUT} element={<Checkout />} />
        <Route path={PATHS.WISHLIST} element={<Wishlist />} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.REGISTER} element={<Register />} />
        <Route path={PATHS.PROFILE} element={<Profile />} />
        <Route path={PATHS.ORDERS} element={<Orders />} />
        <Route path={PATHS.SERVICES} element={<Services />} />
        <Route path={PATHS.SERVICE_BOOKING} element={<ServiceBooking />} />
        <Route path={PATHS.FAQ} element={<FAQ />} />

        {/* Admin Routes */}
        <Route path={PATHS.ADMIN.DASHBOARD} element={<AdminDashboard />} />
        <Route path={PATHS.ADMIN.PRODUCTS} element={<AdminProducts />} />
        <Route path={PATHS.ADMIN.CATEGORIES} element={<AdminCategories />} />
        <Route path={PATHS.ADMIN.ORDERS} element={<AdminOrders />} />
        <Route path={PATHS.ADMIN.USERS} element={<AdminUsers />} />
        <Route path={PATHS.ADMIN.SERVICES} element={<AdminServices />} />
      </Routes>
  );
};

export default AppRoutes;
