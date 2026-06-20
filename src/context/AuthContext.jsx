import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/apiSlice'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const userData = await authApi.fetchProfile()
      setUser(userData)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password)
      localStorage.setItem('token', response.token)
      setUser(response.user)
      closeAuthModal() // Close modal on success
      return { success: true }
    } catch (error) {
      console.error('Login error details:', error.response?.data)
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        details: error.response?.data?.details // Pass details through
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData)
      localStorage.setItem('token', response.token)
      setUser(response.user)
      closeAuthModal() // Close modal on success
      return { success: true }
    } catch (error) {
      console.error('Register error details:', error.response?.data)
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        details: error.response?.data?.details // Pass details through
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('cart') // Clear cart on logout
    setUser(null)
  }

  const updateProfile = async (profileData) => {
    try {
      await authApi.updateProfile(profileData)
      setUser((current) => ({ ...current, ...profileData }))
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      }
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
