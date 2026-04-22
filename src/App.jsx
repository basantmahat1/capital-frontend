import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, IconButton, Box } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Services from './pages/Services'
import ServiceBooking from './pages/ServiceBooking'
import FAQ from './pages/FAQ'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'
import AdminServices from './pages/admin/Services'
import AdminCategories from './pages/admin/Categories'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import './App.css'

function App() {
  const { i18n } = useTranslation()
  const [darkMode, setDarkMode] = useState(false)
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#F0585E', // Coral Red
      },
      secondary: {
        main: '#0F1B2D', // Dark Navy
      },
      background: {
        default: '#FAFBFA', // Soft White
        paper: '#FAFBFA', // Soft White
      },
      text: {
        primary: '#515457', // Steel Gray
        secondary: '#A8A9A7', // Medium Gray
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        color: '#0F1B2D', // Dark Navy
        fontWeight: 700,
      },
      h2: {
        color: '#0F1B2D', // Dark Navy
        fontWeight: 600,
      },
      h3: {
        color: '#0F1B2D', // Dark Navy
        fontWeight: 600,
      },
      h4: {
        color: '#0F1B2D', // Dark Navy
        fontWeight: 600,
      },
      h5: {
        color: '#0F1B2D', // Dark Navy
        fontWeight: 600,
      },
      h6: {
        color: '#0F1B2D', // Dark Navy
        fontWeight: 600,
      },
      body1: {
        color: '#515457', // Steel Gray
      },
      body2: {
        color: '#A8A9A7', // Medium Gray
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
          contained: {
            backgroundColor: '#F0585E', // Coral Red
            color: '#FAFBFA', // Soft White
            '&:hover': {
              backgroundColor: '#E0484E', // Slightly darker Coral Red
            },
          },
          outlined: {
            borderColor: '#D7D3CE', // Light Gray
            color: '#515457', // Steel Gray
            '&:hover': {
              backgroundColor: '#FAFBFA', // Soft White
              borderColor: '#F0585E', // Coral Red
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#0F1B2D', // Dark Navy
            color: '#FAFBFA', // Soft White
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#FAFBFA', // Soft White
            border: `1px solid #D7D3CE`, // Light Gray border
            borderRadius: 12,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#D7D3CE', // Light Gray
              },
              '&:hover fieldset': {
                borderColor: '#A8A9A7', // Medium Gray
              },
              '&.Mui-focused fieldset': {
                borderColor: '#F0585E', // Coral Red
              },
            },
          },
        },
      },
    },
  })

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'np' : 'en')
  }

  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="App min-h-screen bg-soft-white">
            {!isAdminPath && (
              <Navbar
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                toggleLanguage={toggleLanguage}
              />
            )}

            <Box sx={{ minHeight: isAdminPath ? '100vh' : '80vh', backgroundColor: isAdminPath ? '#f8fafc' : '#FAFBFA' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/services" element={<Services />} />
                <Route path="/service-booking" element={<ServiceBooking />} />
                <Route path="/faq" element={<FAQ />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/services" element={<AdminServices />} />
              </Routes>
            </Box>

            {!isAdminPath && <Footer />}
          </div>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
