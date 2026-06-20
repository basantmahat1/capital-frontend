import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../services/apiClient'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  IconButton,
  Alert
} from '@mui/material'
import { Favorite, FavoriteBorder, ShoppingCart } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Wishlist = () => {
  const { user, openAuthModal } = useAuth()
  const { addToCart } = useCart()

  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (user) {
      fetchWishlist()
    }
  }, [user])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/orders/wishlist')
      setWishlistItems(response.data)
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
      setAlert({ type: 'error', message: 'Failed to load wishlist' })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await apiClient.delete(`/orders/wishlist/${productId}`)
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId))
      setAlert({ type: 'success', message: 'Removed from wishlist' })
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to remove from wishlist' })
    }
  }

  const handleAddToCart = async (product) => {
    const result = await addToCart(product.id, 1)
    if (result.success) {
      setAlert({ type: 'success', message: 'Added to cart' })
    } else {
      setAlert({ type: 'error', message: result.message })
    }
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Please login to view your wishlist
        </Typography>
        <Button onClick={() => openAuthModal('login')} variant="contained">
          Login
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Wishlist
      </Typography>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {loading ? (
        <Typography>Loading...</Typography>
      ) : wishlistItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FavoriteBorder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add some products to your wishlist to see them here
          </Typography>
          <Button component={Link} to="/products" variant="contained">
            Start Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.images && item.images[0] ? item.images[0] : '/placeholder.jpg'}
                  alt={item.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
                      Rs. {item.discount_price || item.price}
                    </Typography>
                    {item.discount_price && (
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        Rs. {item.price}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      component={Link}
                      to={`/products/${item.product_id}`}
                      variant="outlined"
                      size="small"
                      sx={{ flex: 1 }}
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      variant="contained"
                      size="small"
                      startIcon={<ShoppingCart />}
                      sx={{ flex: 1 }}
                    >
                      Add to Cart
                    </Button>
                    <IconButton
                      onClick={() => handleRemoveFromWishlist(item.product_id)}
                      color="error"
                      size="small"
                    >
                      <Favorite />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default Wishlist
