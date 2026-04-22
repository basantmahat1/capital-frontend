import { useState, useEffect } from 'react'
import apiClient from '../../api/apiClient'
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Tabs,
  Tab,
  Stack
} from '@mui/material'
import {
  AttachMoney,
  ShoppingCart,
  People,
  Inventory,
  MoreVert,
  ArrowForward,
  BarChart,
  Notifications as NotificationsIcon
} from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'
import AdminLayout from '../../components/AdminLayout'
import { Link, useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [charts, setCharts] = useState({ monthly: [], weekly: [] })
  const [categorySales, setCategorySales] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [serviceStats, setServiceStats] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)
  const [chartTab, setChartTab] = useState(0)

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardData()
      fetchNotifications()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/admin/dashboard')
      setStats(response.data.stats || {})
      setRecentOrders(response.data.recent_orders || [])
      setCharts(response.data.charts || { monthly: [], weekly: [] })
      setCategorySales(response.data.category_sales || [])
      setTopProducts(response.data.top_products || [])
      setServiceStats(response.data.service_stats || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setAlert({ type: 'error', message: 'Failed to load dashboard data' })
    } finally {
      setLoading(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/admin/notifications')
      setNotifications(response.data || [])
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e' }
      case 'processing': return { bg: '#e0f2fe', text: '#075985' }
      case 'shipped': return { bg: '#e0e7ff', text: '#3730a3' }
      case 'delivered': return { bg: '#dcfce7', text: '#166534' }
      case 'cancelled': return { bg: '#fee2e2', text: '#991b1b' }
      default: return { bg: '#f1f5f9', text: '#475569' }
    }
  }

  const statCards = [
    { title: 'Total Revenue', value: `रू ${stats.total_sales?.toLocaleString() || 0}`, icon: <AttachMoney />, color: '#10b981', bg: '#ecfdf5', path: '/admin/orders' },
    { title: 'Total Orders', value: stats.total_orders || 0, icon: <ShoppingCart />, color: '#3b82f6', bg: '#eff6ff', path: '/admin/orders' },
    { title: 'Total Users', value: stats.total_users || 0, icon: <People />, color: '#8b5cf6', bg: '#f5f3ff', path: '/admin/users' },
    { title: 'Active Products', value: stats.total_products || 0, icon: <Inventory />, color: '#f59e0b', bg: '#fff7ed', path: '/admin/products' }
  ]

  // Custom Chart Rendering
  const activeChartData = chartTab === 0 ? charts.monthly : charts.weekly
  const maxVal = Math.max(...(activeChartData.length > 0 ? activeChartData.map(d => d.value) : [0]), 1)

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

  if (loading) {
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
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: '-0.02em' }}>
          Welcome Back, {user?.name?.split(' ')[0]}! 👋
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
          Here's what's happening with your store today.
        </Typography>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 4, borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          {alert.message}
        </Alert>
      )}

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card 
              elevation={0} 
              onClick={() => navigate(card.path)}
              sx={{ 
                borderRadius: '20px', 
                border: '1px solid #e2e8f0', 
                p: 1, 
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)', borderColor: card.color }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                    {card.icon}
                  </Box>
                  <IconButton size="small"><MoreVert fontSize="small" /></IconButton>
                </Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5 }}>
                  {card.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Analytics Section */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BarChart sx={{ color: '#F1585E' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Revenue Analysis
              </Typography>
            </Box>
            <Tabs 
              value={chartTab} 
              onChange={(e, v) => setChartTab(v)} 
              sx={{ 
                minHeight: 0, 
                '& .MuiTabs-indicator': { bgcolor: '#F1585E' },
                '& .MuiTab-root': { py: 1, minHeight: 0, fontWeight: 700, textTransform: 'none', color: '#64748b', '&.Mui-selected': { color: '#F1585E' } }
              }}
            >
              <Tab label="Monthly" />
              <Tab label="Weekly" />
            </Tabs>
          </Box>
          
          <Card elevation={0} sx={{ borderRadius: '24px', border: '1px solid #e2e8f0', p: 3, height: '320px', display: 'flex', flexDirection: 'column', mb: 4 }}>
            {activeChartData.length > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', flexGrow: 1, pt: 2, gap: 1 }}>
                {activeChartData.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, maxWidth: '60px' }}>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        height: `${(item.value / maxVal) * 200}px`, 
                        bgcolor: chartTab === 0 ? '#F1585E' : '#3b82f6', 
                        borderRadius: '6px 6px 0 0',
                        minHeight: '4px',
                        transition: 'height 0.5s ease-out',
                        '&:hover': { opacity: 0.8, cursor: 'pointer' },
                        position: 'relative'
                      }}
                      title={`रू ${item.value}`}
                    />
                    <Typography variant="caption" sx={{ mt: 1.5, color: '#64748b', fontWeight: 600, fontSize: '0.7rem' }}>
                      {item.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <Typography sx={{ color: '#94a3b8' }}>No data available for this period</Typography>
              </Box>
            )}
          </Card>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
              Top Selling Products
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Product Name</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Sold</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topProducts.map((prod, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ fontWeight: 600 }}>{prod.name}</TableCell>
                      <TableCell align="center">{prod.total_sold}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>रू {prod.revenue?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {topProducts.length === 0 && (
                    <TableRow><TableCell colSpan={3} align="center">No sales data yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Notifications
              </Typography>
              <Button onClick={fetchNotifications} startIcon={<NotificationsIcon />} sx={{ color: '#F1585E', textTransform: 'none', fontWeight: 700 }}>
                Refresh
              </Button>
            </Box>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Message</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notifications.slice(0, 5).map((notification) => (
                    <TableRow key={notification.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell sx={{ fontWeight: 600 }}>{notification.title}</TableCell>
                      <TableCell>{notification.message}</TableCell>
                      <TableCell>
                        <Chip
                          label={notification.type}
                          size="small"
                          sx={{ 
                            bgcolor: notification.type === 'order' ? '#e0f2fe' : '#f5f5f5', 
                            color: notification.type === 'order' ? '#075985' : '#64748b', 
                            fontWeight: 700, 
                            textTransform: 'capitalize',
                            borderRadius: '8px'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#64748b' }}>
                        {new Date(notification.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {notifications.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', color: '#94a3b8', py: 4 }}>
                        No notifications yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Recent Orders
              </Typography>
              <Button component={Link} to="/admin/orders" endIcon={<ArrowForward />} sx={{ color: '#F1585E', textTransform: 'none', fontWeight: 700 }}>
                View All
              </Button>
            </Box>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => {
                    const status = getStatusColor(order.order_status)
                    return (
                      <TableRow key={order.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                        <TableCell sx={{ fontWeight: 600 }}>#{order.order_number}</TableCell>
                        <TableCell>{order.customer_name}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>रू {order.total_amount?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.order_status}
                            size="small"
                            sx={{ 
                              bgcolor: status.bg, 
                              color: status.text, 
                              fontWeight: 700, 
                              textTransform: 'capitalize',
                              borderRadius: '8px'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        {/* Info Column */}
        <Grid item xs={12} lg={4}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
            Performance Overview
          </Typography>
          <Stack spacing={3}>
            <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', p: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#64748b', mb: 2 }}>SALES BY CATEGORY</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {categorySales.map((cat, i) => {
                    const totalRevenue = categorySales.reduce((acc, curr) => acc + parseFloat(curr.revenue), 0)
                    const percentage = totalRevenue > 0 ? (parseFloat(cat.revenue) / totalRevenue * 100).toFixed(0) : 0
                    return (
                      <Box key={i}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{cat.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>{percentage}%</Typography>
                        </Box>
                        <Box sx={{ height: 6, bgcolor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                          <Box sx={{ width: `${percentage}%`, height: '100%', bgcolor: '#F1585E' }} />
                        </Box>
                      </Box>
                    )
                  })}
                  {categorySales.length === 0 && (
                    <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center' }}>No category sales data</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', p: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#64748b', mb: 2 }}>SERVICE PERFORMANCE</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {serviceStats.slice(0, 5).map((service, i) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{service.name}</Typography>
                      <Chip label={`${service.request_count} req`} size="small" sx={{ fontWeight: 700, height: 20, fontSize: '0.65rem' }} />
                    </Box>
                  ))}
                  {serviceStats.length === 0 && (
                    <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center' }}>No service data</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </AdminLayout>
  )
  }

  export default Dashboard
