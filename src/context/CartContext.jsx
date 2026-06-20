import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useAuth } from './AuthContext'
import { cartApi } from '../services/apiSlice'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const cartCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems])

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItems(localCart)
    }
  }, [user])

  const fetchCart = async () => {
    try {
      const data = await cartApi.fetchCart()
      setCartItems(data)
      localStorage.setItem('cart', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      // Fallback to local storage
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItems(localCart)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (quantity <= 0) {
      return { success: false, message: 'Quantity must be greater than 0' }
    }

    if (!user) {
      // Handle local cart
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingIndex = localCart.findIndex(item => item.product_id === productId)
      
      if (existingIndex >= 0) {
        localCart[existingIndex].quantity += quantity
      } else {
        localCart.push({ product_id: productId, quantity, name: 'Product', price: 0 }) // Basic structure
      }
      
      localStorage.setItem('cart', JSON.stringify(localCart))
      setCartItems(localCart)
      return { success: true }
    }

    try {
      setLoading(true)
      await cartApi.addToCart(productId, quantity)
      await fetchCart()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to cart'
      }
    } finally {
      setLoading(false)
    }
  }

  const updateCartItem = async (productId, quantity) => {
    if (quantity < 0) {
      return { success: false, message: 'Quantity cannot be negative' }
    }

    if (quantity === 0) {
      return removeFromCart(productId)
    }

    if (!user) {
      // Handle local cart
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingIndex = localCart.findIndex(item => item.product_id === productId)
      
      if (existingIndex >= 0) {
        localCart[existingIndex].quantity = quantity
        localStorage.setItem('cart', JSON.stringify(localCart))
        setCartItems(localCart)
      }
      return { success: true }
    }

    try {
      setLoading(true)
      await cartApi.updateCartItem(productId, quantity)
      await fetchCart()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update cart'
      }
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId) => {
    if (!user) {
      // Handle local cart
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
      const filteredCart = localCart.filter(item => item.product_id !== productId)
      localStorage.setItem('cart', JSON.stringify(filteredCart))
      setCartItems(filteredCart)
      return { success: true }
    }

    try {
      setLoading(true)
      await cartApi.removeFromCart(productId)
      await fetchCart()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove from cart'
      }
    } finally {
      setLoading(false)
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount_price || item.price
      return total + price * item.quantity
    }, 0)
  }

  const clearCart = () => {
    setCartItems([])
  }

  const value = {
    cartItems,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartTotal,
    cartCount,
    clearCart,
    fetchCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
