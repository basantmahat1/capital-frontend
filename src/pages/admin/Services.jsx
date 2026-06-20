import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
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
  IconButton,
  Button
} from '@mui/material'
import {
  MoreVert as MoreIcon,
  Build as ServiceIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'
import AdminLayout from '../../layouts/AdminLayout'

const AdminServices = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check authentication and authorization
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchRequests()
    }
  }, [user])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/admin/service-requests')
      setRequests(response.data || [])
    } catch (err) {
      console.error(err)
      setError('Could not load service requests')
    } finally {
      setLoading(false)
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e' }
      case 'confirmed': return { bg: '#e0f2fe', text: '#075985' }
      case 'completed': return { bg: '#dcfce7', text: '#166534' }
      case 'cancelled': return { bg: '#fee2e2', text: '#991b1b' }
      default: return { bg: '#f1f5f9', text: '#475569' }
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
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: '-0.02em' }}>
            Service Requests
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
            Manage and respond to customer service and maintenance requests.
          </Typography>
        </Box>
        <Button variant="contained" sx={{ bgcolor: '#1e293b', '&:hover': { bgcolor: '#0f172a' }, borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 3 }}>
          Configure Services
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#F1585E' }} />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Service Type</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Request Date</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => {
                const status = getStatusStyle(request.status || 'pending')
                return (
                  <TableRow key={request.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {request.customer_name || 'Anonymous'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {request.customer_email || 'No email provided'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ServiceIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {request.service_name || 'General Service'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 500 }}>
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.status || 'pending'}
                        size="small"
                        sx={{ 
                          bgcolor: status.bg, 
                          color: status.text, 
                          fontWeight: 700, 
                          textTransform: 'uppercase',
                          fontSize: '0.65rem',
                          borderRadius: '6px'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" sx={{ color: '#10b981', mr: 0.5 }}><CheckIcon fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: '#ef4444', mr: 0.5 }}><CancelIcon fontSize="small" /></IconButton>
                      <IconButton size="small"><MoreIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                      No service requests found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </AdminLayout>
  )
}

export default AdminServices
