import { useState, useEffect } from 'react'
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
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material'
import {
  Delete,
  Category as CategoryIcon,
  Add
} from '@mui/icons-material'
import AdminLayout from '../../components/AdminLayout'

const AdminCategories = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    name_np: '',
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)

  // Check authentication and authorization
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchCategories()
    }
  }, [user])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/admin/categories')
      setCategories(response.data)
    } catch (err) {
      console.error(err)
      setError('Could not load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = () => {
    setFormData({ name: '', name_np: '', description: '' })
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setError(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await apiClient.post('/admin/categories', formData)
      setSuccess('Category added successfully')
      fetchCategories()
      handleCloseDialog()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to add category')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This might affect products in this category.')) {
      try {
        await apiClient.delete(`/admin/categories/${id}`)
        setSuccess('Category deleted successfully')
        fetchCategories()
      } catch (err) {
        console.error(err)
        setError('Failed to delete category')
      }
    }
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
            Categories
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            View and manage existing product categories.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
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
          Add New Category
        </Button>
      </Box>

      {error && !dialogOpen && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>{success}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#F1585E' }} />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Nepali Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>#{cat.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CategoryIcon sx={{ color: '#3b82f6' }} />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{cat.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{cat.name_np || '-'}</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>{cat.description || 'No description'}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleDelete(cat.id)} color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Category Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '20px' } }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800, p: 3, pb: 1 }}>
            Add New Category
          </DialogTitle>
          <DialogContent sx={{ p: 3, pt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
              <TextField
                name="name"
                label="Category Name (English)"
                fullWidth
                required
                value={formData.name}
                onChange={handleInputChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
              <TextField
                name="name_np"
                label="Category Name (Nepali)"
                fullWidth
                value={formData.name_np}
                onChange={handleInputChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
            <Button onClick={handleCloseDialog} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
              sx={{ 
                bgcolor: '#F1585E', 
                '&:hover': { bgcolor: '#ef4444' }, 
                textTransform: 'none', 
                fontWeight: 700, 
                borderRadius: '10px',
                px: 3 
              }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Add Category'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </AdminLayout>
  )
}

export default AdminCategories
