import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import apiClient from '../api/apiClient'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Avatar
} from '@mui/material'
import {
  LocalShipping,
  Payment,
  Receipt,
  CheckCircle,
  AccountBalanceWallet,
  AccountBalance,
  LocalAtm
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Checkout = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    payment_method: 'cash_on_delivery'
  })

  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }
  }, [user, cartItems, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setAlert({ type: 'error', message: 'Please fill in all required fields' })
      return
    }

    try {
      setLoading(true)
      const response = await apiClient.post('/orders/checkout', {
        shipping_address: `${formData.name}\n${formData.address}\n${formData.phone}\n${formData.email}`,
        payment_method: formData.payment_method
      })

      if (response.data.success !== false) {
        clearCart()
        navigate('/orders', {
          state: {
            message: 'Order placed successfully!',
            order: response.data.order
          }
        })
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to place order'
      })
    } finally {
      setLoading(false)
    }
  }

  const shippingCost = 100
  const subtotal = getCartTotal()
  const total = subtotal + shippingCost

  if (!user || cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, color: '#1a202c', mb: 4 }}>
        {t('checkout')}
      </Typography>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 4, borderRadius: '12px' }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Stack spacing={4}>
              {/* Shipping Information */}
              <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#F1585E', mr: 2 }}>
                      <LocalShipping />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {t('shipping_information')}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 4 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('name')}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('email')}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('phone')}
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={t('address')}
                        name="address"
                        multiline
                        rows={3}
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="Full address including city, state, postal code"
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#3b82f6', mr: 2 }}>
                      <Payment />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {t('payment_method')}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleInputChange}
                    >
                      <Stack spacing={2}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            borderColor: formData.payment_method === 'cash_on_delivery' ? '#F1585E' : '#e2e8f0',
                            bgcolor: formData.payment_method === 'cash_on_delivery' ? '#fffafb' : 'transparent',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => setFormData(prev => ({ ...prev, payment_method: 'cash_on_delivery' }))}
                        >
                          <FormControlLabel
                            value="cash_on_delivery"
                            control={<Radio sx={{ color: '#F1585E', '&.Mui-checked': { color: '#F1585E' } }} />}
                            label={
                              <Box sx={{ ml: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <LocalAtm sx={{ mr: 1, color: '#475569' }} />
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{t('cash_on_delivery')}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  Pay with cash when your order is delivered to your doorstep.
                                </Typography>
                              </Box>
                            }
                            sx={{ m: 0, width: '100%' }}
                          />
                        </Paper>

                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            borderColor: formData.payment_method === 'esewa' ? '#F1585E' : '#e2e8f0',
                            bgcolor: formData.payment_method === 'esewa' ? '#fffafb' : 'transparent',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => setFormData(prev => ({ ...prev, payment_method: 'esewa' }))}
                        >
                          <FormControlLabel
                            value="esewa"
                            control={<Radio sx={{ color: '#F1585E', '&.Mui-checked': { color: '#F1585E' } }} />}
                            label={
                              <Box sx={{ ml: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AccountBalanceWallet sx={{ mr: 1, color: '#475569' }} />
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>eSewa</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  Pay securely using your eSewa wallet.
                                </Typography>
                              </Box>
                            }
                            sx={{ m: 0, width: '100%' }}
                          />
                        </Paper>

                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            borderColor: formData.payment_method === 'khalti' ? '#F1585E' : '#e2e8f0',
                            bgcolor: formData.payment_method === 'khalti' ? '#fffafb' : 'transparent',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => setFormData(prev => ({ ...prev, payment_method: 'khalti' }))}
                        >
                          <FormControlLabel
                            value="khalti"
                            control={<Radio sx={{ color: '#F1585E', '&.Mui-checked': { color: '#F1585E' } }} />}
                            label={
                              <Box sx={{ ml: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AccountBalanceWallet sx={{ mr: 1, color: '#475569' }} />
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Khalti</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  Pay quickly with your Khalti wallet.
                                </Typography>
                              </Box>
                            }
                            sx={{ m: 0, width: '100%' }}
                          />
                        </Paper>

                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            borderColor: formData.payment_method === 'bank_transfer' ? '#F1585E' : '#e2e8f0',
                            bgcolor: formData.payment_method === 'bank_transfer' ? '#fffafb' : 'transparent',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => setFormData(prev => ({ ...prev, payment_method: 'bank_transfer' }))}
                        >
                          <FormControlLabel
                            value="bank_transfer"
                            control={<Radio sx={{ color: '#F1585E', '&.Mui-checked': { color: '#F1585E' } }} />}
                            label={
                              <Box sx={{ ml: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AccountBalance sx={{ mr: 1, color: '#475569' }} />
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{t('bank_transfer')}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  Transfer directly to our bank account.
                                </Typography>
                              </Box>
                            }
                            sx={{ m: 0, width: '100%' }}
                          />
                        </Paper>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Sidebar - Order Summary */}
          <Grid item xs={12} md={4}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: '20px', 
                border: '1px solid #e2e8f0', 
                position: 'sticky', 
                top: 100,
                bgcolor: '#f8fafc'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#1e293b', mr: 2, width: 32, height: 32 }}>
                    <Receipt fontSize="small" />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {t('order_summary')}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2} sx={{ mb: 3 }}>
                  {cartItems.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Qty: {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        रू {(item.discount_price || item.price) * item.quantity}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">{t('subtotal')}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>रू {subtotal}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">{t('shipping')}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>रू {shippingCost}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>{t('total')}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#F1585E' }}>रू {total}</Typography>
                  </Box>
                </Stack>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? null : <CheckCircle />}
                  sx={{
                    bgcolor: '#F1585E',
                    '&:hover': { bgcolor: '#ef4444' },
                    borderRadius: '12px',
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 8px 16px rgba(241, 88, 94, 0.2)'
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : t('place_order')}
                </Button>
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

export default Checkout