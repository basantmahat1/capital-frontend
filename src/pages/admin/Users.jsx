import { useState, useEffect } from 'react'
import apiClient from '../../api/apiClient'
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
  Avatar,
  IconButton
} from '@mui/material'
import {
  MoreVert as MoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material'
import AdminLayout from '../../components/AdminLayout'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/admin/users')
      setUsers(response.data || [])
    } catch (err) {
      console.error(err)
      setError('Could not load users')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: '-0.02em' }}>
          User Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
          Manage and view all registered users and their roles.
        </Typography>
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
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Contact Info</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Joined Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: user.role === 'admin' ? '#F1585E' : '#3b82f6', fontWeight: 700 }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>{user.email}</Typography>
                      </Box>
                      {user.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                          <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>{user.phone}</Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{ 
                        bgcolor: user.role === 'admin' ? '#fee2e2' : '#e0f2fe', 
                        color: user.role === 'admin' ? '#991b1b' : '#075985',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '0.65rem',
                        borderRadius: '6px'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: 500 }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small"><MoreIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </AdminLayout>
  )
}

export default AdminUsers
