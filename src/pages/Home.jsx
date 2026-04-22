import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  Skeleton
} from '@mui/material'
const Home = () => {
  const { t } = useTranslation()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [bestSellingProducts, setBestSellingProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])
const fetchHomeData = async () => {
  try {
    const [featuredRes, bestSellingRes, categoriesRes] = await Promise.all([
      apiClient.get('/products/featured'),
      apiClient.get('/products/best-selling'),
      apiClient.get('/categories')
    ])

    setFeaturedProducts(featuredRes.data.data || [])
    setBestSellingProducts(bestSellingRes.data.data || [])
    setCategories(categoriesRes.data.data || [])   // 🔥 FIX HERE
  } catch (error) {
    console.error('Failed to fetch home data:', error)
  } finally {
    setLoading(false)
  }
}
  const ProductCard = ({ product }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
          borderColor: '#F1585E'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        {product.discount_price && (
          <Chip 
            label="SALE" 
            size="small" 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              left: 8, 
              bgcolor: '#F1585E', 
              color: 'white', 
              fontWeight: 800,
              fontSize: '0.65rem',
              height: '18px'
            }} 
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 1.5, pb: '12px !important' }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, mb: 0.2, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
          {product.brand || 'General'}
        </Typography>
        <Typography gutterBottom variant="subtitle1" component="div" sx={{ fontWeight: 700, mb: 1, height: '2.6rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontSize: '0.9rem', lineHeight: 1.2 }}>
          {product.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: 800, color: '#F1585E', fontSize: '1rem' }}>
            रू {product.discount_price || product.price}
          </Typography>
          {product.discount_price && (
            <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', fontSize: '0.75rem' }}>
              रू {product.price}
            </Typography>
          )}
        </Box>
        <Button
          component={Link}
          to={`/products/${product.id}`}
          variant="outlined"
          fullWidth
          size="small"
          sx={{ 
            borderRadius: '6px', 
            textTransform: 'none', 
            fontWeight: 700,
            py: 0.5,
            borderColor: '#e2e8f0',
            color: '#1e293b',
            fontSize: '0.8rem',
            '&:hover': { 
              borderColor: '#F1585E',
              bgcolor: 'rgba(241, 88, 94, 0.04)',
              color: '#F1585E'
            }
          }}
        >
          {t('view')}
        </Button>
      </CardContent>
    </Card>
  )

  const CategoryCard = ({ category }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', p: 2 }}>
      {/* Category image hidden */}
      {/* 
      <CardMedia
        component="img"
        height="150"
        image={category.image || '/category-placeholder.jpg'}
        alt={category.name}
      />
      */}
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {category.name}
        </Typography>
      </CardContent>
    </Card>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        id="home"
        sx={{
          minHeight: '95vh',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 4, md: 6 },
          alignItems: 'center',
          px: { xs: 2, md: 8 },
          py: 6,
          background: '#f8fafc'
        }}
      >
        <Box sx={{ color: '#111' }}>
          <Chip
            label="Smart Business Partner"
            sx={{
              background: '#fee2e2',
              color: '#b91c1c',
              px: 2.5,
              py: 1.25,
              borderRadius: 50,
              fontWeight: 700,
              mb: 2,
              fontSize: '0.95rem'
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '42px', md: '58px' },
              lineHeight: 1.05,
              color: '#111',
              fontWeight: 800,
              mb: 3,
              maxWidth: '680px'
            }}
          >
            We Build Powerful Digital Solutions For Your Business
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#475569',
              lineHeight: 1.8,
              mb: 5,
              fontSize: { xs: '1rem', md: '1.15rem' },
              maxWidth: '620px'
            }}
          >
            From premium websites to ecommerce platforms and secure IT infrastructure, we deliver modern technology solutions that help your business grow faster.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/contact"
              variant="contained"
              sx={{
                backgroundColor: '#ef4444',
                color: '#fff',
                px: 4,
                py: 1.75,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: '1.05rem',
                '&:hover': {
                  backgroundColor: '#dc2626',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.25s ease'
              }}
            >
              Contact Us
            </Button>
            <Button
              component={Link}
              to="/services"
              variant="contained"
              sx={{
                backgroundColor: '#111827',
                color: '#fff',
                px: 4,
                py: 1.75,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: '1.05rem',
                '&:hover': {
                  backgroundColor: '#1f2937',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.25s ease'
              }}
            >
              Our Services
            </Button>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', minHeight: { xs: 420, md: 520 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: '110%',
              height: '100%',
              background: 'linear-gradient(135deg, #111827 0%, #7c2d12 100%)',
              borderRadius: '220px 0 0 220px',
              boxShadow: '0 30px 80px rgba(17, 24, 39, 0.25)',
              zIndex: 1,
              transform: { xs: 'translateX(6%)', md: 'translateX(14%)' }
            }}
          />
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200"
            alt="teamwork"
            sx={{
              width: { xs: '90%', md: '86%' },
              maxWidth: '620px',
              borderRadius: '28px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              position: 'relative',
              zIndex: 2
            }}
          />
        </Box>
      </Box>

      {/* Categories Section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        {t('categories')}
      </Typography>
      {loading ? (
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {categories.map((category) => (
            <Grid item xs={12} sm={4} md={2.4} key={category.id}>
              <Link to={`/products?category=${category.id}`} style={{ textDecoration: 'none' }}>
                <CategoryCard category={category} />
              </Link>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Featured Products */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        {t('featured_products')}
      </Typography>
      {loading ? (
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Best Selling Products */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        {t('best_selling')}
      </Typography>
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {bestSellingProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Services Section */}
      <Box sx={{
        textAlign: 'center',
        mt: 10,
        py: 8,
        background: 'linear-gradient(135deg, #FAFBFA 0%, #D7D3CE 100%)',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom sx={{
            color: '#0F1B2D',
            fontWeight: 700,
            mb: 3
          }}>
            {t('it_services')}
          </Typography>
          <Typography variant="h6" sx={{
            mb: 4,
            color: '#515457',
            fontWeight: 400,
            lineHeight: 1.6
          }}>
            Professional IT services for your business and personal needs with expert technicians
          </Typography>
          <Button
            component={Link}
            to="/services"
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#F0585E',
              color: '#F0585E',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              borderWidth: 2,
              '&:hover': {
                backgroundColor: '#F0585E',
                color: '#FAFBFA',
                borderColor: '#F0585E',
                boxShadow: '0 4px 14px rgba(240, 88, 94, 0.2)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {t('view_services')}
          </Button>
        </Container>
      </Box>
    </Container>
  )
}

export default Home