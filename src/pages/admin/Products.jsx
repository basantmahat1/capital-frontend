import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/apiClient'
import { useAuth } from '../../context/AuthContext'
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
  InputAdornment,
  Avatar,
  FormControlLabel,
  Checkbox,
  Divider,
  Pagination,
  Stack,
  Badge
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Search as SearchIcon,
  FilterList as FilterIcon,
  DeleteOutline,
  CloudUpload,
  AddCircleOutline,
  Close,
  Clear as ClearIcon
} from '@mui/icons-material'
import AdminLayout from '../../components/AdminLayout'

const AdminProducts = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const fileInputRef = useRef(null)

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('DESC')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0, limit: 10 })

  const initialFormState = {
    name: '',
    description: '',
    price: '',
    discount_price: '',
    category_id: '',
    brand: '',
    stock_quantity: '',
    images: [],
    specifications: [{ key: '', value: '' }],
    is_featured: false,
    is_best_selling: false
  }

  const [formData, setFormData] = useState(initialFormState)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Check authentication and authorization
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchProducts()
    }
  }, [debouncedSearch, filterCategory, sortBy, sortOrder, page, user])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 10,
        search: debouncedSearch,
        category_id: filterCategory || undefined,
        sort_by: sortBy,
        sort_order: sortOrder
      }
      const response = await apiClient.get('/admin/products', { params })
      setProducts(response.data.products || [])
      setPagination(response.data.pagination || { total: 0, pages: 0, limit: 10 })
    } catch (err) {
      console.error(err)
      setError('Could not load products: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/admin/categories')
      setCategories(response.data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterCategory('')
    setSortBy('created_at')
    setSortOrder('DESC')
    setPage(1)
  }

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product)
      
      let specs = [{ key: '', value: '' }]
      if (product.specifications) {
        try {
          const parsedSpecs = typeof product.specifications === 'string' 
            ? JSON.parse(product.specifications) 
            : product.specifications
          
          const specEntries = Object.entries(parsedSpecs)
          if (specEntries.length > 0) {
            specs = specEntries.map(([key, value]) => ({ key, value }))
          }
        } catch(e) { console.error("Error parsing specs", e) }
      }

      let imgs = product.images
      if (typeof imgs === 'string') {
        try { imgs = JSON.parse(imgs) } catch(e) { imgs = [] }
      }
      if (!Array.isArray(imgs)) imgs = []

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        discount_price: product.discount_price || '',
        category_id: product.category_id || '',
        brand: product.brand || '',
        stock_quantity: product.stock_quantity || '',
        images: imgs,
        specifications: specs,
        is_featured: !!product.is_featured,
        is_best_selling: !!product.is_best_selling
      })
    } else {
      setEditingProduct(null)
      setFormData(initialFormState)
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingProduct(null)
    setFormData(initialFormState)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const specsObj = {}
      formData.specifications.forEach(s => {
        if (s.key.trim() && s.value.trim()) {
          specsObj[s.key.trim()] = s.value.trim()
        }
      })

      const data = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        images: formData.images
          .filter(img => img)
          .map(img => typeof img === 'string' ? img : img.url)
          .filter(url => url && url.trim() !== ''),
        specifications: specsObj,
        is_featured: formData.is_featured ? 1 : 0,
        is_best_selling: formData.is_best_selling ? 1 : 0
      }

      if (editingProduct) {
        await apiClient.put(`/admin/products/${editingProduct.id}`, data)
        setSuccess('Product updated successfully')
      } else {
        await apiClient.post('/admin/products', data)
        setSuccess('Product created successfully')
      }

      fetchProducts()
      handleCloseDialog()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to save product')
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.delete(`/admin/products/${productId}`)
        setSuccess('Product deleted successfully')
        fetchProducts()
      } catch (err) {
        console.error(err)
        setError('Failed to delete product')
      }
    }
  }

  const handleFileSelect = (event) => {
    const files = event.target.files
    if (files) {
      const remainingSlots = 5 - formData.images.length
      if (remainingSlots <= 0) {
        setError('You can only upload up to 5 images per product.')
        return
      }

      const filesToUpload = Array.from(files).slice(0, remainingSlots)

      filesToUpload.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = {
            url: e.target.result,
            fileName: file.name
          }
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, imageData]
          }))
        }
        reader.readAsDataURL(file)
      })

      if (files.length > remainingSlots) {
        setError(`Only the first ${remainingSlots} images were added. Maximum 5 images allowed.`)
      }
    }
    event.target.value = ''
  }

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specifications]
    newSpecs[index][field] = value
    setFormData({ ...formData, specifications: newSpecs })
  }

  const addSpecField = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: '', value: '' }]
    })
  }

  const removeSpecField = (index) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index)
    setFormData({ ...formData, specifications: newSpecs })
  }

  if (authLoading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress sx={{ color: '#F1585E' }} />
        </Box>
      </AdminLayout>
    )
  }

  if (!user || user.role !== 'admin') {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress sx={{ color: '#F1585E' }} />
        </Box>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: '-0.02em' }}>
            Products Inventory
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
            Manage your catalog, stock, and product details.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            bgcolor: '#F1585E', 
            '&:hover': { bgcolor: '#ef4444' }, 
            borderRadius: '12px', 
            px: 3, 
            py: 1.2, 
            textTransform: 'none', 
            fontWeight: 700,
            boxShadow: '0 8px 16px rgba(241, 88, 94, 0.2)'
          }}
        >
          Add New Product
        </Button>
      </Box>

      {/* Filters and Search */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search products..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            bgcolor: 'white', 
            borderRadius: '12px', 
            width: { xs: '100%', md: 300 },
            '& .MuiOutlinedInput-root': { borderRadius: '12px' }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            label="Category"
            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
            sx={{ borderRadius: '12px', bgcolor: 'white' }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            sx={{ borderRadius: '12px', bgcolor: 'white' }}
          >
            <MenuItem value="created_at">Newest First</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="stock_quantity">Stock</MenuItem>
          </Select>
        </FormControl>

        <IconButton onClick={() => { setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC'); setPage(1); }} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0' }}>
          <FilterIcon sx={{ transform: sortOrder === 'ASC' ? 'rotate(180deg)' : 'none' }} />
        </IconButton>

        {(searchTerm || filterCategory || sortBy !== 'created_at') && (
          <Button startIcon={<ClearIcon />} onClick={clearFilters} size="small" sx={{ textTransform: 'none', color: '#ef4444' }}>
            Clear
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
        {error}
        <Button size="small" onClick={fetchProducts} sx={{ ml: 2 }}>Retry</Button>
      </Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>{success}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#F1585E' }} />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', mb: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Badges</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#64748b' }}>
                      No products found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    let imgs = []
                    try {
                      imgs = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
                    } catch(e) {}
                    
                    return (
                      <TableRow key={product.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              variant="rounded" 
                              src={Array.isArray(imgs) ? imgs[0] : null} 
                              sx={{ width: 44, height: 44, bgcolor: '#f1f5f9', border: '1px solid #e2e8f0' }}
                            >
                              {product.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{product.name}</Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>{product.brand || 'No Brand'}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={product.category_name || 'Uncategorized'} 
                            size="small" 
                            sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600, borderRadius: '6px' }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>रू {product.price?.toLocaleString()}</Typography>
                          {product.discount_price && (
                            <Typography variant="caption" sx={{ color: '#F1585E', textDecoration: 'line-through' }}>रू {product.discount_price?.toLocaleString()}</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of Stock'}
                            size="small"
                            sx={{ 
                              bgcolor: product.stock_quantity > 0 ? '#dcfce7' : '#fee2e2', 
                              color: product.stock_quantity > 0 ? '#166534' : '#991b1b',
                              fontWeight: 700,
                              borderRadius: '8px'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {product.is_featured ? <Chip label="Featured" size="small" color="primary" sx={{ fontSize: '0.65rem', height: 20 }} /> : null}
                            {product.is_best_selling ? <Chip label="Best Seller" size="small" color="secondary" sx={{ fontSize: '0.65rem', height: 20 }} /> : null}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            onClick={() => handleOpenDialog(product)} 
                            sx={{ color: '#3b82f6', bgcolor: '#eff6ff', mr: 1, '&:hover': { bgcolor: '#dbeafe' } }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(product.id)} 
                            sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Stack spacing={2} sx={{ alignItems: 'center', mb: 4 }}>
            <Pagination 
              count={pagination.pages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              sx={{ '& .MuiPaginationItem-root': { fontWeight: 700 } }}
            />
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Showing {products.length} of {pagination.total} products
            </Typography>
          </Stack>
        </>
      )}

      {/* Product Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '20px' } }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800, p: 2, pb: 1 }}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent sx={{ p: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Product Name" size="small" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                  <InputLabel>Category</InputLabel>
                  <Select 
                    value={formData.category_id} 
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} 
                    required 
                    label="Category"
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)
                    ) : (
                      <MenuItem disabled value="">No categories found</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Brand" size="small" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Stock Quantity" size="small" type="number" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Price" size="small" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Discount Price" size="small" type="number" value={formData.discount_price} onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Description" size="small" multiline rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>

              <Grid item xs={6}>
                <FormControlLabel control={<Checkbox size="small" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} />} label={<Typography variant="body2">Featured</Typography>} />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel control={<Checkbox size="small" checked={formData.is_best_selling} onChange={(e) => setFormData({ ...formData, is_best_selling: e.target.checked })} />} label={<Typography variant="body2">Best Seller</Typography>} />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📸 Upload Product Images ({formData.images.length}/5)
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    disabled={formData.images.length >= 5}
                    sx={{ 
                      color: '#F1585E', 
                      borderColor: '#F1585E',
                      '&:hover': { borderColor: '#ef4444', bgcolor: '#fff5f5' },
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: '12px',
                      px: 3,
                      py: 1
                    }}
                  >
                    Choose Images
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={formData.images.length >= 5}
                    />
                  </Button>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#64748b' }}>
                    * You can upload up to 5 high-quality images. First image will be the cover.
                  </Typography>
                </Box>

                {/* Display uploaded images with specific styling */}
                {formData.images.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                    {formData.images.filter(img => img).map((image, idx) => (
                      <Badge
                        key={idx}
                        badgeContent={
                          <IconButton
                            size="small"
                            sx={{
                              backgroundColor: '#ef4444',
                              color: 'white',
                              p: 0.2,
                              '&:hover': { backgroundColor: '#dc2626' },
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                            onClick={() => removeImageField(idx)}
                          >
                            <Close sx={{ fontSize: 14 }} />
                          </IconButton>
                        }
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            width: 80,
                            height: 80,
                            overflow: 'hidden',
                            borderRadius: '12px',
                            border: idx === 0 ? '2px solid #F1585E' : '1px solid #e2e8f0',
                            position: 'relative'
                          }}
                        >
                          <img 
                            src={typeof image === 'string' ? image : image.url} 
                            alt={`product-${idx}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {idx === 0 && (
                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(241, 88, 94, 0.8)', color: 'white', py: 0.2, textAlign: 'center' }}>
                              <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 800 }}>COVER</Typography>
                            </Box>
                          )}
                        </Paper>
                      </Badge>
                    ))}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Specifications</Typography>
                  <Button startIcon={<AddCircleOutline />} onClick={addSpecField} size="small" sx={{ textTransform: 'none' }}>Add Spec</Button>
                </Box>
                {formData.specifications.map((spec, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                    <TextField 
                      label="Key" 
                      value={spec.key} 
                      onChange={(e) => handleSpecChange(idx, 'key', e.target.value)} 
                      size="small" 
                      sx={{ width: '40%', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} 
                    />
                    <TextField 
                      label="Value" 
                      value={spec.value} 
                      onChange={(e) => handleSpecChange(idx, 'value', e.target.value)} 
                      size="small" 
                      sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} 
                    />
                    <IconButton onClick={() => removeSpecField(idx)} color="error">
                      <DeleteOutline />
                    </IconButton>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
            <Button onClick={handleCloseDialog} size="small" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}>Cancel</Button>
            <Button type="submit" variant="contained" size="small" sx={{ bgcolor: '#F1585E', '&:hover': { bgcolor: '#ef4444' }, textTransform: 'none', fontWeight: 700, borderRadius: '10px', px: 3 }}>
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </AdminLayout>
  )
}

export default AdminProducts
