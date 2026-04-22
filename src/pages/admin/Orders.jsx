import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Divider,
  Grid,
  TextField,
  InputAdornment,
  InputLabel,
  Stack,
  Pagination,
  Snackbar,
  Tabs,
  Tab
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Payment as PaymentIcon
} from '@mui/icons-material'
import AdminLayout from '../../components/AdminLayout'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const AdminOrders = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingOrder, setUpdatingOrder] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderDetails, setOrderDetails] = useState([])
  const [downloadingInvoice, setDownloadingInvoice] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Dialog states
  const [paymentConfirmOpen, setPaymentConfirmOpen] = useState(false)
  const [orderForPayment, setOrderForPayment] = useState(null)

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPayment, setFilterPayment] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('DESC')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0, limit: 10 })
  
  // Initialize currentTab from URL
  const [currentTab, setCurrentTab] = useState(searchParams.get('tab') === 'delivered' ? 1 : 0)

  // Update currentTab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab')
    setCurrentTab(tab === 'delivered' ? 1 : 0)
  }, [searchParams])

  // Show notification
  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    if (newValue === 1) {
      setSearchParams({ tab: 'delivered' })
    } else {
      setSearchParams({})
    }
    setPage(1)
  }

  // Export Functions
  const handlePrint = () => {
    if (orders.length === 0) {
      showNotification('No orders to print', 'warning')
      return
    }

    const printWindow = window.open('', '', 'width=900,height=600')
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Orders Export - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #F1585E; padding-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #F1585E; color: white; padding: 12px; text-align: left; border: 1px solid #F1585E; }
            td { padding: 10px 12px; border: 1px solid #e2e8f0; }
            .status { padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 12px; }
            .status.delivered { background-color: #dcfce7; color: #166534; }
          </style>
        </head>
        <body>
          <div class="header"><h1>Delivered Orders Report</h1><p>Generated on ${new Date().toLocaleString()}</p></div>
          <table>
            <thead><tr><th>Order #</th><th>Customer</th><th>Amount</th><th>Status</th><th>Payment</th><th>Date</th></tr></thead>
            <tbody>
              ${orders.map(order => `
                <tr>
                  <td>#${order.order_number}</td>
                  <td>${order.customer_name}</td>
                  <td>रू ${order.total_amount?.toLocaleString()}</td>
                  <td><span class="status ${order.order_status}">${order.order_status}</span></td>
                  <td>${order.payment_status}</td>
                  <td>${new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 250)
  }

  const handleExportExcel = () => {
    if (orders.length === 0) {
      showNotification('No orders to export', 'warning')
      return
    }
    const headers = ['Order #', 'Customer', 'Email', 'Amount', 'Status', 'Payment', 'Date']
    const data = orders.map(order => [
      order.order_number,
      order.customer_name,
      order.customer_email,
      order.total_amount,
      order.order_status,
      order.payment_status,
      new Date(order.created_at).toLocaleDateString()
    ])
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Delivered Orders')
    XLSX.writeFile(wb, `Delivered_Orders_${new Date().toLocaleDateString()}.xlsx`)
  }

  const downloadInvoice = async (order, items) => {
    setDownloadingInvoice(true)
    try {
      const invoiceElement = document.createElement('div')
      invoiceElement.style.position = 'absolute'
      invoiceElement.style.left = '-9999px'
      invoiceElement.style.width = '800px'
      invoiceElement.style.backgroundColor = 'white'
      invoiceElement.style.padding = '40px'
      invoiceElement.innerHTML = `
        <div style="text-align: center; border-bottom: 3px solid #F1585E; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #F1585E;">INVOICE</h1>
          <p>CapitalIt Solution</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div><h3>Invoice To:</h3><p>${order.customer_name}</p><p>${order.customer_email}</p></div>
          <div style="text-align: right;"><p>Order #: ${order.order_number}</p><p>Date: ${new Date(order.created_at).toLocaleDateString()}</p></div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr style="background: #F1585E; color: white;"><th style="padding: 10px;">Item</th><th style="padding: 10px;">Qty</th><th style="padding: 10px; text-align: right;">Total</th></tr>
          ${items.map(item => `<tr><td style="padding: 10px; border: 1px solid #eee;">${item.product_name}</td><td style="padding: 10px; border: 1px solid #eee; text-align: center;">${item.quantity}</td><td style="padding: 10px; border: 1px solid #eee; text-align: right;">रू ${(item.quantity * item.price).toLocaleString()}</td></tr>`).join('')}
          <tr><td colspan="2" style="padding: 10px; text-align: right;"><strong>Grand Total:</strong></td><td style="padding: 10px; text-align: right;"><strong>रू ${order.total_amount.toLocaleString()}</strong></td></tr>
        </table>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
          <p><strong>Payment Status:</strong> ${order.payment_status}</p>
        </div>
      `
      document.body.appendChild(invoiceElement)
      const canvas = await html2canvas(invoiceElement, { scale: 2 })
      document.body.removeChild(invoiceElement)
      const pdf = new jsPDF('p', 'mm', 'a4')
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width)
      pdf.save(`Invoice_${order.order_number}.pdf`)
    } catch (error) { showNotification('Failed to generate invoice', 'error') }
    finally { setDownloadingInvoice(false) }
  }

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchTerm); setPage(1); }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    if (user && user.role === 'admin') fetchOrders()
  }, [debouncedSearch, filterStatus, filterPayment, sortBy, sortOrder, page, user, currentTab])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = {
        page, limit: 10, search: debouncedSearch,
        order_status: currentTab === 1 ? 'delivered' : (filterStatus || undefined),
        payment_status: filterPayment || undefined,
        sort_by: sortBy, sort_order: sortOrder
      }
      const response = await apiClient.get('/admin/orders', { params })
      setOrders(response.data.orders || [])
      setPagination(response.data.pagination || { total: 0, pages: 0, limit: 10 })
    } catch (err) { setError('Could not load orders') }
    finally { setLoading(false) }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId)
      await apiClient.put(`/admin/orders/${orderId}/status`, { order_status: newStatus })
      setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o))
      showNotification('Status updated')
    } catch (err) { showNotification('Failed to update status', 'error') }
    finally { setUpdatingOrder(null) }
  }

  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId)
      await apiClient.put(`/admin/orders/${orderId}/status`, { payment_status: newStatus })
      setOrders(orders.map(o => o.id === orderId ? { ...o, payment_status: newStatus } : o))
      showNotification(`Payment marked as ${newStatus}. Revenue updated!`)
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, payment_status: newStatus })
      }
      setPaymentConfirmOpen(false)
    } catch (err) { showNotification('Failed to update payment', 'error') }
    finally { setUpdatingOrder(null) }
  }

  const handleOpenPaymentConfirm = (order) => {
    setOrderForPayment(order)
    setPaymentConfirmOpen(true)
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e' }
      case 'processing': return { bg: '#e0f2fe', text: '#075985' }
      case 'shipped': return { bg: '#e0e7ff', text: '#3730a3' }
      case 'delivered': return { bg: '#dcfce7', text: '#166534' }
      case 'cancelled': return { bg: '#fee2e2', text: '#991b1b' }
      default: return { bg: '#f1f5f9', text: '#475569' }
    }
  }

  return (
    <AdminLayout>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: '12px' }}>{snackbar.message}</Alert>
      </Snackbar>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>Orders Management</Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>Track and manage customer orders.</Typography>
        </Box>
        {currentTab === 1 && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />} 
              onClick={handleExportExcel} 
              sx={{ borderRadius: '10px', bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, textTransform: 'none', fontWeight: 700 }}
            >
              Excel Report
            </Button>
            <Button 
              variant="contained" 
              startIcon={<PrintIcon />} 
              onClick={handlePrint} 
              sx={{ borderRadius: '10px', bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, textTransform: 'none', fontWeight: 700 }}
            >
              Print List
            </Button>
          </Box>
        )}
      </Box>

      <Tabs 
        value={currentTab} 
        onChange={handleTabChange} 
        sx={{ 
          mb: 3, 
          borderBottom: 1, 
          borderColor: 'divider',
          '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '1rem' },
          '& .Mui-selected': { color: '#F1585E !important' },
          '& .MuiTabs-indicator': { bgcolor: '#F1585E' }
        }}
      >
        <Tab label="All Orders" />
        <Tab label="Delivered Orders" />
      </Tabs>

      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField 
          placeholder="Search order #, customer..." 
          size="small" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          sx={{ bgcolor: 'white', borderRadius: '12px', width: { xs: '100%', sm: 300 } }} 
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
        />
        {currentTab === 0 && (
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select value={filterStatus} label="Status Filter" onChange={(e) => setFilterStatus(e.target.value)} sx={{ borderRadius: '10px', bgcolor: 'white' }}>
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto', my: 10, color: '#F1585E' }} /> : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Order Number</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Order Status</TableCell>
                {currentTab === 1 && <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Payment Tracking</TableCell>}
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={currentTab === 1 ? 6 : 5} align="center" sx={{ py: 10 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>No orders found</Typography>
                      <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                        {currentTab === 1 ? 'Mark some orders as "Delivered" to see them here.' : 'Try adjusting your filters.'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} sx={{ '&:hover': { bgcolor: '#f1f5f9' }, transition: 'background-color 0.2s' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>#{order.order_number}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{order.customer_name}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{order.customer_email}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#1e293b' }}>रू {order.total_amount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Select 
                        size="small" 
                        value={order.order_status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)} 
                        sx={{ 
                          ...getStatusStyle(order.order_status), 
                          borderRadius: '8px', 
                          fontWeight: 700, 
                          fontSize: '0.8rem',
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                        }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </TableCell>
                    {currentTab === 1 && (
                      <TableCell>
                        <Chip 
                          icon={order.payment_status === 'paid' ? <CheckCircleIcon style={{ color: 'white' }} /> : <PaymentIcon />}
                          label={order.payment_status === 'paid' ? 'PAYMENT COMPLETED' : 'MARK AS PAID'} 
                          color={order.payment_status === 'paid' ? 'success' : 'warning'}
                          onClick={() => order.payment_status !== 'paid' && handleOpenPaymentConfirm(order)}
                          sx={{ 
                            fontWeight: 800, 
                            cursor: order.payment_status !== 'paid' ? 'pointer' : 'default',
                            borderRadius: '8px',
                            px: 1,
                            '& .MuiChip-label': { px: 1.5 }
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <IconButton onClick={() => { setSelectedOrder(order); apiClient.get(`/orders/${order.id}`).then(res => setOrderDetails(res.data.order_items)) }} sx={{ color: '#F1585E', bgcolor: '#fff1f2', '&:hover': { bgcolor: '#ffe4e6' } }}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Payment Confirmation Dialog */}
      <Dialog open={paymentConfirmOpen} onClose={() => setPaymentConfirmOpen(false)} sx={{ '& .MuiDialog-paper': { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem' }}>Confirm Payment Received</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#475569', mb: 2 }}>
            Are you sure you want to mark order <strong>#{orderForPayment?.order_number}</strong> as paid?
          </Typography>
          <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bcf0da' }}>
            <Typography variant="body2" sx={{ color: '#166534', fontWeight: 600 }}>
              This will add <strong>रू {orderForPayment?.total_amount?.toLocaleString()}</strong> to your total revenue and update dashboard charts.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setPaymentConfirmOpen(false)} sx={{ fontWeight: 700, color: '#64748b', textTransform: 'none' }}>Cancel</Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={() => updatePaymentStatus(orderForPayment.id, 'paid')} 
            sx={{ fontWeight: 800, textTransform: 'none', px: 3, borderRadius: '10px' }}
          >
            Confirm & Update Revenue
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '24px' } }}>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Order Details #{selectedOrder?.order_number}
          <IconButton onClick={() => setSelectedOrder(null)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '20px', height: '100%', border: '1px solid #e2e8f0' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>Customer Information</Typography>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>Name</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedOrder.customer_name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>Email</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedOrder.customer_email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>Address</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{selectedOrder.shipping_address}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '20px', height: '100%', border: '1px solid #e2e8f0' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>Payment Summary</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>Current Status</Typography>
                    <Chip 
                      label={selectedOrder.payment_status === 'paid' ? 'COMPLETED' : 'PENDING'} 
                      size="small"
                      color={selectedOrder.payment_status === 'paid' ? 'success' : 'warning'}
                      sx={{ fontWeight: 800, borderRadius: '6px' }}
                    />
                  </Box>
                  {selectedOrder.payment_status !== 'paid' && (
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="success" 
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleOpenPaymentConfirm(selectedOrder)}
                      sx={{ mb: 2, textTransform: 'none', fontWeight: 800, borderRadius: '12px', py: 1 }}
                    >
                      Receive Payment
                    </Button>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Total Paid</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#F1585E' }}>रू {selectedOrder.total_amount?.toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={() => setSelectedOrder(null)} sx={{ color: '#64748b', fontWeight: 700 }}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => downloadInvoice(selectedOrder, orderDetails)} 
            startIcon={downloadingInvoice ? <CircularProgress size={20} color="inherit" /> : <PdfIcon />}
            disabled={downloadingInvoice}
            sx={{ bgcolor: '#1e293b', '&:hover': { bgcolor: '#0f172a' }, borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            {downloadingInvoice ? 'Generating...' : 'Download Invoice PDF'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  )
}

export default AdminOrders
