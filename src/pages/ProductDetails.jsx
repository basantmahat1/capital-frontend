import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import apiClient from '../api/apiClient'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  Divider,
  TextField,
  // Rating,
  // Avatar,
  Skeleton,
  Alert,
  IconButton,
  Paper,
  Badge
} from '@mui/material'
import { Add, Remove, ShoppingCart, Favorite, FavoriteBorder, CloudUpload, Close, ArrowBack } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const ProductDetails = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart, updateCartItem, cartItems } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [alert, setAlert] = useState(null)
  const [inWishlist, setInWishlist] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploading, setUploading] = useState(false)

  const isInCart = cartItems.some(item => item.product_id === parseInt(id))
  const cartItem = cartItems.find(item => item.product_id === parseInt(id))

  useEffect(() => {
    fetchProduct()
    if (user) checkWishlist()
  }, [id])

  useEffect(() => {
    // Update quantity when cart items change
    if (isInCart && cartItem) {
      setQuantity(cartItem.quantity)
    } else if (!isInCart) {
      setQuantity(1)
    }
  }, [cartItems, id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get(`/products/${id}`)
      const data = response.data
      // Ensure images is an array even if backend fails to parse (safety check)
      if (typeof data.images === 'string') {
        try { data.images = JSON.parse(data.images) } catch(e) { data.images = [] }
      }
      setProduct(data)
    } catch (error) {
      console.error('Failed to fetch product:', error)
      setAlert({ type: 'error', message: 'Failed to load product' })
    } finally {
      setLoading(false)
    }
  }

  const checkWishlist = async () => {
    try {
      const response = await apiClient.get('/orders/wishlist')
      const wishlist = response.data
      setInWishlist(wishlist.some(item => item.product_id === parseInt(id)))
    } catch (error) {
      console.error('Failed to check wishlist:', error)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (isInCart) {
      // Update existing cart item
      const result = await updateCartItem(parseInt(id), quantity)
      if (result.success) {
        setAlert({ type: 'success', message: 'Cart updated successfully' })
      } else {
        setAlert({ type: 'error', message: result.message })
      }
    } else {
      // Add new item to cart
      const result = await addToCart(parseInt(id), quantity)
      if (result.success) {
        setAlert({ type: 'success', message: 'Product added to cart' })
      } else {
        setAlert({ type: 'error', message: result.message })
      }
    }
  }

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      if (inWishlist) {
        await apiClient.delete(`/orders/wishlist/${id}`)
        setInWishlist(false)
        setAlert({ type: 'success', message: 'Removed from wishlist' })
      } else {
        await apiClient.post('/orders/wishlist', { product_id: id })
        setInWishlist(true)
        setAlert({ type: 'success', message: 'Added to wishlist' })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update wishlist' })
    }
  }

  // const handleSubmitReview = async () => {
  //   if (!user) {
  //     navigate('/login')
  //     return
  //   }

  //   try {
  //     setSubmittingReview(true)
  //     await apiClient.post(`/products/${id}/reviews`, {
  //       rating: reviewRating,
  //       review_text: reviewText
  //     })

  //     setReviewText('')
  //     setReviewRating(5)
  //     setAlert({ type: 'success', message: 'Review submitted successfully' })
  //     fetchProduct() // Refresh product data to show new review
  //   } catch (error) {
  //     setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to submit review' })
  //   } finally {
  //     setSubmittingReview(false)
  //   }
  // }

  const updateQuantity = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 1)) {
      setQuantity(newQuantity)
    }
  }

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    const maxImages = 5
    const remaining = maxImages - uploadedImages.length
    
    if (files.length > remaining) {
      setAlert({ type: 'warning', message: `Only ${remaining} more images allowed (max 5)` })
      return
    }

    try {
      setUploading(true)
      const newImages = []
      
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'products')
        
        const response = await apiClient.post('/cloudinary/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        if (response.data.url) {
          newImages.push(response.data.url)
        }
      }
      
      setUploadedImages([...uploadedImages, ...newImages])
      setAlert({ type: 'success', message: `${newImages.length} image(s) uploaded successfully` })
    } catch (error) {
      console.error('Image upload failed:', error)
      setAlert({ type: 'error', message: 'Failed to upload images' })
    } finally {
      setUploading(false)
    }
  }

  const removeUploadedImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={30} />
            <Skeleton variant="text" height={20} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Product not found
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ 
          mb: 3, 
          textTransform: 'none', 
          fontWeight: 700, 
          color: '#64748b',
          '&:hover': { color: '#1e293b', bgcolor: '#f1f5f9' }
        }}
      >
        Back to Products
      </Button>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
            <Box
              sx={{
                height: 450,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              <CardMedia
                component="img"
                image={product.images && product.images[selectedImage] ? product.images[selectedImage] : '/placeholder.jpg'}
                alt={product.name}
                sx={{ 
                  height: '100%',
                  width: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>
          </Paper>

          {/* Image Thumbnails */}
          <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
            {product.images && product.images.map((image, index) => (
              <Paper
                key={index}
                onClick={() => setSelectedImage(index)}
                sx={{
                  minWidth: 90,
                  height: 90,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: 1,
                  border: selectedImage === index ? '3px solid' : '2px solid',
                  borderColor: selectedImage === index ? 'primary.main' : '#e0e0e0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 2
                  }
                }}
              >
                <CardMedia
                  component="img"
                  image={image}
                  alt={`${product.name} ${index + 1}`}
                  sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                />
              </Paper>
            ))}
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, color: '#1a1a1a' }}>
              {product.name}
            </Typography>

            {/* Price Section */}
            <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#f0f9ff', borderRadius: 2, mb: 2.5 }}>
              <Typography variant="body2" sx={{ color: '#475569', mb: 0.5 }}>
                Price
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#ef4444' }}>
                  Rs. {product.discount_price || product.price}
                </Typography>
                {product.discount_price && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      textDecoration: 'line-through',
                      color: '#94a3b8'
                    }}
                  >
                    Rs. {product.price}
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Product Details */}
            <Box sx={{ mb: 2.5 }}>
              <Box sx={{ display: 'flex', mb: 1.5, pb: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="body2" sx={{ color: '#64748b', minWidth: 100 }}>
                  <strong>Brand:</strong>
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {product.brand}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Chip
                  label={product.stock_quantity > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                  color={product.stock_quantity > 0 ? 'success' : 'error'}
                  sx={{ fontWeight: 600 }}
                  variant="filled"
                />
                {product.stock_quantity > 0 && (
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    {product.stock_quantity} units available
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2.5 }} />

            {/* Quantity Selector */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontWeight: 600 }}>
                Quantity
              </Typography>
              <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', width: 'fit-content', backgroundColor: '#f1f5f9', p: 0.5, borderRadius: 1 }}>
                <IconButton 
                  onClick={() => updateQuantity(-1)} 
                  disabled={quantity <= 1}
                  size="small"
                  sx={{ color: '#ef4444' }}
                >
                  <Remove sx={{ fontSize: 20 }} />
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (!isNaN(val) && val >= 1 && val <= product.stock_quantity) {
                      setQuantity(val)
                    }
                  }}
                  inputProps={{ min: 1, max: product.stock_quantity, style: { textAlign: 'center' } }}
                  sx={{ 
                    width: 60,
                    '& .MuiOutlinedInput-root': {
                      border: 'none',
                      backgroundColor: 'transparent'
                    }
                  }}
                  size="small"
                  variant="standard"
                />
                <IconButton 
                  onClick={() => updateQuantity(1)} 
                  disabled={quantity >= product.stock_quantity}
                  size="small"
                  sx={{ color: '#10b981' }}
                >
                  <Add sx={{ fontSize: 20 }} />
                </IconButton>
              </Paper>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                sx={{
                  flex: 1,
                  backgroundColor: '#ef4444',
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#dc2626'
                  },
                  textTransform: 'none'
                }}
              >
                {isInCart ? `Update Cart (${cartItem?.quantity || 0})` : 'Add to Cart'}
              </Button>
              <IconButton
                color={inWishlist ? 'error' : 'default'}
                onClick={handleAddToWishlist}
                size="large"
                sx={{
                  border: '2px solid',
                  borderColor: inWishlist ? '#ef4444' : '#e2e8f0',
                  backgroundColor: inWishlist ? '#fee2e2' : '#f8fafc'
                }}
              >
                {inWishlist ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* Product Description */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2.5, color: '#1e293b' }}>
            📝 {t('description')}
          </Typography>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 2, mb: 4 }}>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#475569' }}>
              {product.description}
            </Typography>
          </Paper>

          {/* Specifications */}
          {product.specifications && (
            <>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2.5, color: '#1e293b' }}>
                ⚙️ {t('specifications')}
              </Typography>
              <Box sx={{ mb: 3 }}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <Paper
                    key={key}
                    elevation={0}
                    sx={{
                      display: 'flex',
                      mb: 1,
                      p: 2,
                      backgroundColor: '#f1f5f9',
                      borderRadius: 1,
                      borderLeft: '4px solid #3b82f6'
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 140, color: '#1e293b' }}>
                      {key}:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569' }}>{value}</Typography>
                  </Paper>
                ))}
              </Box>
            </>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#1e293b' }}>
              ℹ️ Product Info
            </Typography>
            <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                Category
              </Typography>
              <Chip
                label={product.category_name}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600, backgroundColor: '#f0f9ff' }}
              />
            </Box>
            <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                Brand
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {product.brand}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                Product Code
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                #PRD{product.id}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Reviews Section - COMMENTED OUT */}
      {/* 
      <Typography variant="h5" component="h2" gutterBottom>
        {t('reviews')} ({product.reviews?.length || 0})
      </Typography>

      {/* Write Review */}
      {/*
      {user && (
        <Card sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t('write_review')}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography component="legend">{t('rating')}</Typography>
            <Rating
              value={reviewRating}
              onChange={(event, newValue) => {
                setReviewRating(newValue)
              }}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('review_text')}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={submittingReview}
          >
            {submittingReview ? t('submitting') : t('submit_review')}
          </Button>
        </Card>
      )}

      {/* Display Reviews */}
      {/*
      {product.reviews && product.reviews.length > 0 ? (
        <Grid container spacing={2}>
          {product.reviews.map((review) => (
            <Grid item xs={12} key={review.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ mr: 2 }}>{review.user_name.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="subtitle1">{review.user_name}</Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body1">{review.review_text}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('no_reviews_yet')}
        </Typography>
      )}
      */}
    </Container>
  )
}

export default ProductDetails