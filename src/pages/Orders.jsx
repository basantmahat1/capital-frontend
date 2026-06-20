import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import apiClient from '../services/apiClient'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  ExpandMore,
  ShoppingBag,
  Download as DownloadIcon,
  Receipt as ReceiptIcon,
  LocalShipping,
  Payment,
  CalendarToday,
  CheckCircle,
  HourglassEmpty,
  Cancel,
  DirectionsBike,
  Inventory
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

const Orders = () => {
  const { user } = useAuth()
  const location = useLocation()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(location.state?.message ? { type: 'success', message: location.state.message } : null)
  const [downloadingId, setDownloadingId] = useState(null)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/orders')
      setOrders(response.data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setAlert({ type: 'error', message: 'Failed to load orders' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { color: '#92400e', bg: '#fef3c7', border: '#fcd34d', icon: <HourglassEmpty sx={{ fontSize: 14 }} />, label: 'Pending' }
      case 'processing':
        return { color: '#075985', bg: '#e0f2fe', border: '#7dd3fc', icon: <Inventory sx={{ fontSize: 14 }} />, label: 'Processing' }
      case 'shipped':
        return { color: '#3730a3', bg: '#e0e7ff', border: '#a5b4fc', icon: <DirectionsBike sx={{ fontSize: 14 }} />, label: 'Shipped' }
      case 'delivered':
        return { color: '#166534', bg: '#dcfce7', border: '#86efac', icon: <CheckCircle sx={{ fontSize: 14 }} />, label: 'Delivered' }
      case 'cancelled':
        return { color: '#991b1b', bg: '#fee2e2', border: '#fca5a5', icon: <Cancel sx={{ fontSize: 14 }} />, label: 'Cancelled' }
      default:
        return { color: '#475569', bg: '#f1f5f9', border: '#cbd5e1', icon: null, label: status }
    }
  }

  const getPaymentStatusConfig = (status) => {
    switch (status) {
      case 'paid':
        return { color: '#166534', bg: '#dcfce7', label: 'Paid' }
      case 'pending':
        return { color: '#92400e', bg: '#fef3c7', label: 'Pending' }
      case 'failed':
        return { color: '#991b1b', bg: '#fee2e2', label: 'Failed' }
      default:
        return { color: '#475569', bg: '#f1f5f9', label: status }
    }
  }

  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'cash_on_delivery': return 'Cash on Delivery'
      case 'esewa': return 'eSewa'
      case 'khalti': return 'Khalti'
      case 'bank_transfer': return 'Bank Transfer'
      default: return method
    }
  }

  const handleDownloadInvoice = (order) => {
    setDownloadingId(order.id)

    const invoiceDate = new Date(order.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const invoiceNumber = `INV-${order.order_number}`
    const printDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const items = order.items || []
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1e293b;">
          <strong>${item.product_name || 'Product'}</strong>
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #f1f5f9; text-align: center; font-size: 14px; color: #475569;">
          ${item.quantity}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #f1f5f9; text-align: right; font-size: 14px; color: #475569;">
          रू ${Number(item.price).toLocaleString()}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #f1f5f9; text-align: right; font-size: 14px; font-weight: 700; color: #1e293b;">
          रू ${(item.quantity * item.price).toLocaleString()}
        </td>
      </tr>
    `).join('')

    const payStatus = order.payment_status
    const payStatusColor = payStatus === 'paid' ? '#166534' : payStatus === 'pending' ? '#92400e' : '#991b1b'
    const payStatusBg = payStatus === 'paid' ? '#dcfce7' : payStatus === 'pending' ? '#fef3c7' : '#fee2e2'

    const orderStatus = order.order_status
    const orderStatusColor = orderStatus === 'delivered' ? '#166534' : orderStatus === 'cancelled' ? '#991b1b' : '#075985'
    const orderStatusBg = orderStatus === 'delivered' ? '#dcfce7' : orderStatus === 'cancelled' ? '#fee2e2' : '#e0f2fe'

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Invoice - ${invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #f8fafc;
              color: #334155;
              min-height: 100vh;
              display: flex;
              align-items: flex-start;
              justify-content: center;
              padding: 30px 20px;
            }
            .invoice-wrapper {
              background: #ffffff;
              max-width: 820px;
              width: 100%;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.12);
              overflow: hidden;
            }
            /* TOP BANNER */
            .invoice-banner {
              background: linear-gradient(135deg, #0F1B2D 0%, #1e3a5f 100%);
              padding: 36px 40px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .company-brand h1 {
              color: #F0585E;
              font-size: 30px;
              font-weight: 900;
              letter-spacing: -0.5px;
              margin-bottom: 6px;
            }
            .company-brand p {
              color: #94a3b8;
              font-size: 13px;
              line-height: 1.6;
            }
            .invoice-meta {
              text-align: right;
            }
            .invoice-meta .invoice-label {
              color: #94a3b8;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              margin-bottom: 6px;
            }
            .invoice-meta h2 {
              color: #ffffff;
              font-size: 26px;
              font-weight: 800;
              margin-bottom: 12px;
            }
            .invoice-meta .meta-row {
              color: #cbd5e1;
              font-size: 13px;
              margin: 4px 0;
            }
            .invoice-meta .meta-row strong {
              color: #ffffff;
            }
            .status-pill {
              display: inline-block;
              padding: 4px 14px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            /* BODY */
            .invoice-body {
              padding: 36px 40px;
            }
            /* INFO CARDS */
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 32px;
            }
            .info-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 14px;
              padding: 20px;
            }
            .info-card-title {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #F0585E;
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .info-card-title::before {
              content: '';
              display: inline-block;
              width: 3px;
              height: 12px;
              background: #F0585E;
              border-radius: 2px;
            }
            .info-card p {
              font-size: 13px;
              color: #475569;
              margin: 4px 0;
              line-height: 1.5;
            }
            .info-card p strong {
              color: #1e293b;
              font-weight: 700;
            }
            /* TABLE */
            .section-title {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #64748b;
              margin-bottom: 14px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .section-title::before {
              content: '';
              display: inline-block;
              width: 3px;
              height: 12px;
              background: #F0585E;
              border-radius: 2px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
              border-radius: 14px;
              overflow: hidden;
              border: 1px solid #e2e8f0;
            }
            thead tr {
              background: linear-gradient(135deg, #F0585E, #e04050);
            }
            thead th {
              padding: 14px 16px;
              color: white;
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              text-align: left;
            }
            thead th:nth-child(2) { text-align: center; }
            thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
            tbody tr:last-child td { border-bottom: none; }
            tbody tr:hover { background: #fafbff; }
            /* TOTALS */
            .totals-section {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 28px;
            }
            .totals-box {
              width: 320px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 14px;
              overflow: hidden;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 20px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 14px;
            }
            .totals-row:last-child { border-bottom: none; }
            .totals-row .label { color: #64748b; }
            .totals-row .value { font-weight: 600; color: #1e293b; }
            .totals-row.grand {
              background: linear-gradient(135deg, #0F1B2D, #1e3a5f);
              padding: 16px 20px;
            }
            .totals-row.grand .label {
              color: #94a3b8;
              font-weight: 800;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .totals-row.grand .value {
              color: #F0585E;
              font-size: 20px;
              font-weight: 900;
            }
            /* FOOTER */
            .invoice-footer {
              background: #f8fafc;
              border-top: 1px solid #e2e8f0;
              padding: 24px 40px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .footer-left p {
              font-size: 12px;
              color: #94a3b8;
              margin: 2px 0;
            }
            .footer-left p strong { color: #64748b; }
            .footer-right {
              text-align: right;
            }
            .footer-right p {
              font-size: 11px;
              color: #94a3b8;
            }
            .thank-you {
              font-size: 16px;
              font-weight: 800;
              color: #1e293b;
              margin-bottom: 4px;
            }
            /* PRINT BUTTONS */
            .print-actions {
              text-align: center;
              padding: 24px;
              background: #f1f5f9;
              border-top: 1px solid #e2e8f0;
            }
            .btn {
              display: inline-block;
              padding: 12px 32px;
              border: none;
              border-radius: 10px;
              font-size: 15px;
              font-weight: 700;
              cursor: pointer;
              margin: 0 8px;
              transition: opacity 0.2s;
            }
            .btn:hover { opacity: 0.85; }
            .btn-primary { background: #F0585E; color: white; }
            .btn-secondary { background: #64748b; color: white; }
            @media print {
              body { background: white; padding: 0; }
              .invoice-wrapper { box-shadow: none; border-radius: 0; }
              .print-actions { display: none !important; }
              thead tr { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .invoice-banner { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .totals-row.grand { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-wrapper">
            <!-- BANNER -->
            <div class="invoice-banner">
              <div class="company-brand">
                <h1>CapitalIt Solution</h1>
                <p>Putalisadak, Kathmandu, Nepal</p>
                <p>📞 +977-01-XXXXXXX</p>
                <p>✉️ info@capitalit.com.np</p>
              </div>
              <div class="invoice-meta">
                <div class="invoice-label">Tax Invoice</div>
                <h2>${invoiceNumber}</h2>
                <div class="meta-row"><strong>Order:</strong> #${order.order_number}</div>
                <div class="meta-row"><strong>Date:</strong> ${invoiceDate}</div>
                <div class="meta-row" style="margin-top: 10px;">
                  <span class="status-pill" style="background:${payStatusBg}; color:${payStatusColor};">
                    ${payStatus.toUpperCase()}
                  </span>
                  &nbsp;
                  <span class="status-pill" style="background:${orderStatusBg}; color:${orderStatusColor};">
                    ${orderStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <!-- BODY -->
            <div class="invoice-body">
              <!-- INFO CARDS -->
              <div class="info-grid">
                <div class="info-card">
                  <div class="info-card-title">Customer Details</div>
                  <p><strong>${user?.name || 'Customer'}</strong></p>
                  <p>${user?.email || ''}</p>
                  ${user?.phone ? `<p>📞 ${user.phone}</p>` : ''}
                </div>
                <div class="info-card">
                  <div class="info-card-title">Shipping & Payment</div>
                  <p><strong>Address:</strong> ${order.shipping_address || 'N/A'}</p>
                  <p><strong>Method:</strong> ${formatPaymentMethod(order.payment_method)}</p>
                  <p><strong>Payment:</strong> <span style="color:${payStatusColor}; font-weight:700;">${payStatus.charAt(0).toUpperCase() + payStatus.slice(1)}</span></p>
                </div>
              </div>

              <!-- ITEMS TABLE -->
              <div class="section-title">Order Items</div>
              <table>
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml || '<tr><td colspan="4" style="text-align:center; padding:20px; color:#94a3b8;">No items found</td></tr>'}
                </tbody>
              </table>

              <!-- TOTALS -->
              <div class="totals-section">
                <div class="totals-box">
                  <div class="totals-row">
                    <span class="label">Subtotal</span>
                    <span class="value">रू ${Number(order.total_amount).toLocaleString()}</span>
                  </div>
                  <div class="totals-row">
                    <span class="label">Shipping</span>
                    <span class="value" style="color:#166534;">Free</span>
                  </div>
                  <div class="totals-row">
                    <span class="label">Tax</span>
                    <span class="value">Included</span>
                  </div>
                  <div class="totals-row grand">
                    <span class="label">TOTAL DUE</span>
                    <span class="value">रू ${Number(order.total_amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="invoice-footer">
              <div class="footer-left">
                <p class="thank-you">Thank you for your purchase! 🎉</p>
                <p>For support: <strong>info@capitalit.com.np</strong></p>
                <p>Generated on ${printDate}</p>
              </div>
              <div class="footer-right">
                <p>CapitalIt Solution</p>
                <p>All Rights Reserved © ${new Date().getFullYear()}</p>
              </div>
            </div>

            <!-- PRINT ACTIONS -->
            <div class="print-actions">
              <button class="btn btn-primary" onclick="window.print()">🖨️ Print Invoice</button>
              <button class="btn btn-secondary" onclick="window.close()">✕ Close</button>
            </div>
          </div>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank', 'width=920,height=750')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
    }
    setDownloadingId(null)
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6">Please login to view your orders</Typography>
      </Container>
    )
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#F0585E' }} />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em', mb: 0.5 }}>
          My Orders
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Track and manage all your purchases
        </Typography>
      </Box>

      {alert && (
        <Alert
          severity={alert.type}
          sx={{ mb: 3, borderRadius: '14px' }}
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '20px' }}>
          <CardContent sx={{ textAlign: 'center', py: 10 }}>
            <Box sx={{
              width: 80, height: 80, borderRadius: '50%',
              bgcolor: '#fff1f2', display: 'flex', alignItems: 'center',
              justifyContent: 'center', mx: 'auto', mb: 3
            }}>
              <ShoppingBag sx={{ fontSize: 40, color: '#F0585E' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
              No orders yet
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
              Looks like you haven't placed any orders. Start shopping!
            </Typography>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              sx={{
                bgcolor: '#F0585E',
                '&:hover': { bgcolor: '#d9464e' },
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map((order) => {
            const statusCfg = getStatusConfig(order.order_status)
            const paymentCfg = getPaymentStatusConfig(order.payment_status)
            return (
              <Accordion
                key={order.id}
                elevation={0}
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px !important',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { borderColor: '#F0585E', boxShadow: '0 4px 20px rgba(240,88,94,0.1)' },
                  overflow: 'hidden'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: '#64748b' }} />}
                  sx={{ px: 3, py: 1.5, '&.Mui-expanded': { bgcolor: '#fff8f8' } }}
                >
                  <Grid container spacing={2} alignItems="center">
                    {/* Order Number */}
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 40, height: 40, borderRadius: '10px',
                          bgcolor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <ReceiptIcon sx={{ color: '#F0585E', fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                            #{order.order_number}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarToday sx={{ fontSize: 11, color: '#94a3b8' }} />
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                              {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Order Status */}
                    <Grid item xs={6} sm={2}>
                      <Chip
                        icon={statusCfg.icon}
                        label={statusCfg.label}
                        size="small"
                        sx={{
                          bgcolor: statusCfg.bg,
                          color: statusCfg.color,
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          border: `1px solid ${statusCfg.border}`,
                          '& .MuiChip-icon': { color: statusCfg.color }
                        }}
                      />
                    </Grid>

                    {/* Payment Status */}
                    <Grid item xs={6} sm={2}>
                      <Chip
                        label={paymentCfg.label}
                        size="small"
                        variant="outlined"
                        sx={{
                          bgcolor: paymentCfg.bg,
                          color: paymentCfg.color,
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          borderColor: paymentCfg.color
                        }}
                      />
                    </Grid>

                    {/* Amount */}
                    <Grid item xs={6} sm={2}>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        रू {Number(order.total_amount).toLocaleString()}
                      </Typography>
                    </Grid>

                    {/* Payment Method */}
                    <Grid item xs={6} sm={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Payment sx={{ fontSize: 14, color: '#94a3b8' }} />
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                          {formatPaymentMethod(order.payment_method)}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Download Button */}
                    <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                      <Tooltip title="Download Invoice">
                        <IconButton
                          onClick={(e) => { e.stopPropagation(); handleDownloadInvoice(order) }}
                          disabled={downloadingId === order.id}
                          size="small"
                          sx={{
                            bgcolor: '#F0585E',
                            color: 'white',
                            width: 34,
                            height: 34,
                            '&:hover': { bgcolor: '#d9464e' },
                            '&:disabled': { bgcolor: '#cbd5e1' }
                          }}
                        >
                          {downloadingId === order.id
                            ? <CircularProgress size={16} sx={{ color: 'white' }} />
                            : <DownloadIcon sx={{ fontSize: 18 }} />
                          }
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </AccordionSummary>

                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    {/* Shipping Address */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <LocalShipping sx={{ color: '#F0585E', fontSize: 18 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                            Shipping Address
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                          {order.shipping_address}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Payment Info */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <Payment sx={{ color: '#F0585E', fontSize: 18 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                            Payment Info
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>Method</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                              {formatPaymentMethod(order.payment_method)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>Status</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: paymentCfg.color }}>
                              {paymentCfg.label}
                            </Typography>
                          </Box>
                          <Divider sx={{ my: 0.5 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>Total</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#F0585E', fontSize: '1rem' }}>
                              रू {Number(order.total_amount).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Items Count */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <ShoppingBag sx={{ color: '#F0585E', fontSize: 18 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                            Order Summary
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                          {order.items?.length || 0} item(s) ordered
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadInvoice(order)}
                          disabled={downloadingId === order.id}
                          sx={{
                            borderColor: '#F0585E',
                            color: '#F0585E',
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 700,
                            '&:hover': { bgcolor: '#fff1f2', borderColor: '#d9464e' }
                          }}
                        >
                          Download Invoice
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Order Items Table */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
                      Order Items
                    </Typography>
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 1.5 }}>Product</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: '#64748b', py: 1.5 }}>Qty</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', py: 1.5 }}>Price</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', py: 1.5 }}>Subtotal</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.items && order.items.map((item, index) => (
                            <TableRow key={index} sx={{ '&:hover': { bgcolor: '#fafbff' } }}>
                              <TableCell sx={{ py: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  {item.product_image && (
                                    <img
                                      src={item.product_image}
                                      alt={item.product_name}
                                      style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                                    />
                                  )}
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                    {item.product_name}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`×${item.quantity}`}
                                  size="small"
                                  sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: '0.75rem' }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                  रू {Number(item.price).toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                  रू {(item.price * item.quantity).toLocaleString()}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                          {/* Total Row */}
                          <TableRow sx={{ bgcolor: '#f8fafc' }}>
                            <TableCell colSpan={3} align="right" sx={{ fontWeight: 800, color: '#1e293b', py: 2 }}>
                              Total Amount:
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 900, color: '#F0585E', fontSize: '1rem', py: 2 }}>
                              रू {Number(order.total_amount).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )
          })}
        </Box>
      )}
    </Container>
  )
}

export default Orders
