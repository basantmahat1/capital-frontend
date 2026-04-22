import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  Divider,
  TextField,
  Alert,
  Paper,
  Stack,
  Avatar,
  Breadcrumbs,
  Chip
} from '@mui/material'
import { 
  Add, 
  Remove, 
  DeleteOutline, 
  ShoppingCart, 
  ArrowBack,
  CheckCircle,
  LocalShipping,
  ReceiptLong,
  ShoppingBagOutlined
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { cartItems, updateCartItem, removeFromCart, getCartTotal, loading } = useCart()
  const navigate = useNavigate()

  const [alert, setAlert] = useState(null)

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return

    const result = await updateCartItem(productId, newQuantity)
    if (!result.success) {
      setAlert({ type: 'error', message: result.message })
    }
  }

  const handleRemoveItem = async (productId) => {
    const result = await removeFromCart(productId)
    if (!result.success) {
      setAlert({ type: 'error', message: result.message })
    } else {
      setAlert({ type: 'success', message: 'Item removed from cart' })
    }
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: '#f1f5f9', mx: 'auto', mb: 2 }}>
            <ShoppingBagOutlined sx={{ fontSize: 50, color: '#94a3b8' }} />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
            {t('cart_empty')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
            {t('cart_empty_message')}
          </Typography>
          <Button 
            component={Link} 
            to="/products" 
            variant="contained" 
            size="large"
            startIcon={<ArrowBack />}
            sx={{ 
              bgcolor: '#F1585E', 
              '&:hover': { bgcolor: '#ef4444' },
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: '0 8px 16px rgba(241, 88, 94, 0.2)'
            }}
          >
            {t('continue_shopping')}
          </Button>
        </Box>
      </Container>
    )
  }

  const shippingCost = 100
  const subtotal = getCartTotal()
  const total = subtotal + shippingCost

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#64748b' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Home</Typography>
        </Link>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>Cart</Typography>
      </Breadcrumbs>

      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, color: '#1e293b', mb: 4 }}>
        {t('shopping_cart')} <Typography component="span" variant="h4" sx={{ color: '#94a3b8', fontWeight: 400 }}>({cartItems.length} items)</Typography>
      </Typography>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 4, borderRadius: '12px' }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Cart Items List */}
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {cartItems.map((item) => (
              <Card 
                key={item.id} 
                elevation={0}
                sx={{ 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#F1585E',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4} sm={2.5}>
                      <Link to={`/products/${item.product_id}`} style={{ textDecoration: 'none' }}>
                        <CardMedia
                          component="img"
                          height="100"
                          image={item.images && item.images[0] ? item.images[0] : '/placeholder.jpg'}
                          alt={item.name}
                          sx={{ 
                            borderRadius: '12px',
                            objectFit: 'cover',
                            bgcolor: '#f8fafc'
                          }}
                        />
                      </Link>
                    </Grid>
                    
                    <Grid item xs={8} sm={4.5}>
                      <Link to={`/products/${item.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.2 }}>
                          {item.name}
                        </Typography>
                      </Link>
                      <Typography variant="body2" sx={{ color: '#F1585E', fontWeight: 800, mb: 1 }}>
                        रू {item.discount_price || item.price}
                      </Typography>
                      <Chip 
                        label={item.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          height: '20px', 
                          fontSize: '0.65rem', 
                          fontWeight: 700,
                          color: item.stock_quantity > 0 ? '#10b981' : '#ef4444',
                          borderColor: item.stock_quantity > 0 ? '#10b981' : '#ef4444'
                        }} 
                      />
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'center' } }}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            bgcolor: '#f1f5f9', 
                            borderRadius: '10px',
                            p: 0.5
                          }}
                        >
                          <IconButton
                            onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || loading}
                            size="small"
                            sx={{ color: '#64748b' }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography sx={{ mx: 1.5, fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock_quantity || loading}
                            size="small"
                            sx={{ color: '#F1585E' }}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Paper>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={2}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
                          रू {(item.discount_price || item.price) * item.quantity}
                        </Typography>
                        <IconButton
                          onClick={() => handleRemoveItem(item.product_id)}
                          color="error"
                          disabled={loading}
                          size="small"
                          sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
          
          <Button
            component={Link}
            to="/products"
            startIcon={<ArrowBack />}
            sx={{ mt: 3, textTransform: 'none', fontWeight: 700, color: '#64748b' }}
          >
            {t('continue_shopping')}
          </Button>
        </Grid>

        {/* Cart Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: '20px', 
              border: '1px solid #e2e8f0', 
              position: 'sticky', 
              top: 100,
              bgcolor: '#f8fafc',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ bgcolor: '#1e293b', p: 2.5, color: 'white', display: 'flex', alignItems: 'center' }}>
              <ReceiptLong sx={{ mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{t('order_summary')}</Typography>
            </Box>
            
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" color="text.secondary">{t('subtotal')}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>रू {subtotal}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" color="text.secondary">{t('shipping')}</Typography>
                    <LocalShipping sx={{ ml: 1, fontSize: 16, color: '#94a3b8' }} />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>रू {shippingCost}</Typography>
                </Box>
                
                <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>{t('total')}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#F1585E' }}>रू {total}</Typography>
                </Box>
                
                <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: '#f0fdf4', borderColor: '#bbf7d0', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircle sx={{ color: '#10b981', fontSize: 20, mr: 1.5, mt: 0.2 }} />
                    <Typography variant="body2" sx={{ color: '#166534', fontWeight: 500 }}>
                      You're saving extra money on this order! Secure checkout is ready.
                    </Typography>
                  </Box>
                </Paper>
                
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                  disabled={loading}
                  endIcon={<ShoppingCart />}
                  sx={{
                    bgcolor: '#F1585E',
                    '&:hover': { bgcolor: '#ef4444' },
                    borderRadius: '12px',
                    py: 1.8,
                    fontWeight: 800,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 16px rgba(241, 88, 94, 0.2)',
                    mb: 2
                  }}
                >
                  {t('proceed_to_checkout')}
                </Button>
                
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: '#e2e8f0' }}>
                      <CheckCircle sx={{ fontSize: 14, color: '#64748b' }} />
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">Secure payment processing</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: '#e2e8f0' }}>
                      <CheckCircle sx={{ fontSize: 14, color: '#64748b' }} />
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">Easy returns within 7 days</Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Cart