import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import apiClient from '../api/apiClient'
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { useAuth } from '../context/AuthContext'

const ServiceBooking = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const serviceId = searchParams.get('service')
  const type = searchParams.get('type') || 'booking'

  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(serviceId || '')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    problem_description: '',
    preferred_date: '',
    subject: ''
  })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await apiClient.get('/services')
      setServices(response.data)
    } catch (error) {
      console.error('Failed to fetch services:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (type === 'booking' && !selectedService) {
      setAlert({ type: 'error', message: 'Please select a service' })
      return
    }

    if (!formData.name || !formData.email || !formData.phone) {
      setAlert({ type: 'error', message: 'Please fill in all required fields' })
      return
    }

    if (type === 'booking' && !formData.problem_description) {
      setAlert({ type: 'error', message: 'Please describe your problem' })
      return
    }

    if (type === 'inquiry' && !formData.subject) {
      setAlert({ type: 'error', message: 'Please provide a subject' })
      return
    }

    try {
      setLoading(true)

      if (type === 'booking') {
        await apiClient.post('/services/request', {
          service_id: selectedService,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          problem_description: formData.problem_description,
          preferred_date: formData.preferred_date
        })
      } else {
        await apiClient.post('/services/inquiry', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.problem_description
        })
      }

      setAlert({
        type: 'success',
        message: type === 'booking' ? 'Service request submitted successfully!' : 'Inquiry sent successfully!'
      })

      // Reset form
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        problem_description: '',
        preferred_date: '',
        subject: ''
      })
      setSelectedService('')

    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to submit request'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {type === 'booking' ? t('service_booking') : t('inquiry_form')}
      </Typography>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {type === 'booking' && (
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>{t('select_service')}</InputLabel>
                    <Select
                      value={selectedService}
                      onChange={handleServiceChange}
                      label={t('select_service')}
                    >
                      {services.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.name} {service.price && `- Rs. ${service.price}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('name')}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('preferred_date')}
                  name="preferred_date"
                  type="date"
                  value={formData.preferred_date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('address')}
                  name="address"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>

              {type === 'inquiry' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('subject')}
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={type === 'booking' ? t('problem_description') : t('message')}
                  name="problem_description"
                  multiline
                  rows={4}
                  value={formData.problem_description}
                  onChange={handleInputChange}
                  required
                  placeholder={type === 'booking' ? 'Describe your technical problem...' : 'Describe your inquiry...'}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : (type === 'booking' ? t('submit_request') : t('send_inquiry'))}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default ServiceBooking