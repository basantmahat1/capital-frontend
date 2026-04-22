import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
  Pagination,
  Skeleton,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'

const Products = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({})
  const [page, setPage] = useState(1)
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')

  useEffect(() => {
    fetchCategories()
  }, [])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchProducts()
    // Sync URL params
    const params = {}
    if (debouncedSearch) params.search = debouncedSearch
    if (selectedCategory) params.category = selectedCategory
    setSearchParams(params)
  }, [page, debouncedSearch, selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const queryParams = new URLSearchParams({
        page: page,
        limit: 12,
        search: debouncedSearch,
        category: selectedCategory
      })
      const response = await apiClient.get(`/products?${queryParams.toString()}`)
      setProducts(response.data.products || [])
      setPagination(response.data.pagination || {})
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError(error.message || 'Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (event, value) => {
    setPage(value)
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

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, color: '#1a202c' }}>
          Explore Our Catalog
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Discover the best deals on high-quality electronics, components, and solutions for your business.
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={2} sx={{ maxWidth: 900, mx: 'auto', alignItems: 'center' }}>
          <Grid item xs={12} md={7}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 0.5, 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f8fafc'
              }}
            >
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 2 }}>
                      <SearchIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    
                    <InputAdornment position="end" sx={{ pr: 1 }}>
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { py: 1, px: 1, fontSize: '0.95rem' }
                }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
                sx={{ borderRadius: '12px', bgcolor: '#f8fafc' }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        {/* Category Chips for quick selection */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Chip 
            label="All" 
            onClick={() => setSelectedCategory('')}
            color={selectedCategory === '' ? 'primary' : 'default'}
            variant={selectedCategory === '' ? 'filled' : 'outlined'}
            sx={{ borderRadius: '8px', fontWeight: 600 }}
          />
          {categories.map((cat) => (
            <Chip 
              key={cat.id}
              label={cat.name} 
              onClick={() => setSelectedCategory(cat.id.toString())}
              color={selectedCategory === cat.id.toString() ? 'primary' : 'default'}
              variant={selectedCategory === cat.id.toString() ? 'filled' : 'outlined'}
              sx={{ borderRadius: '8px', fontWeight: 600 }}
            />
          ))}
        </Box>
      </Box>

      {/* Products Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: '16px' }} />
              <Skeleton variant="text" sx={{ mt: 2 }} />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Box sx={{ mb: 2 }}>
            <SearchIcon sx={{ fontSize: 64, color: '#cbd5e1' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#475569', mb: 1 }}>
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search terms or filters.
          </Typography>
          <Button 
            onClick={() => { setSearchTerm(''); setSelectedCategory(''); }} 
            sx={{ mt: 3, textTransform: 'none', fontWeight: 700 }}
          >
            Clear All Filters
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <Pagination
                count={pagination.pages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 700,
                    borderRadius: '10px'
                  }
                }}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default Products