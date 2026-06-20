import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import Navbar from './layouts/Navbar'
import Footer from './layouts/Footer'
import AuthModal from './components/AuthModal'
import AppRoutes from './components/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { theme } from './styles/theme'

function App() {
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')

  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthModal />
          <div className="min-h-screen bg-[#FAFBFA]">
            {!isAdminPath && (
              <Navbar />
            )}

            <Box sx={{ minHeight: isAdminPath ? '100vh' : '80vh', backgroundColor: isAdminPath ? '#f8fafc' : '#FAFBFA' }}>
              <AppRoutes />
            </Box>

            {!isAdminPath && <Footer />}
          </div>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
