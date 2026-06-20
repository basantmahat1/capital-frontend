import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import apiClient from '../services/apiClient'
import { SERVICES_LIST } from '../constants/services'
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
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const serviceId = searchParams.get('service')
  const type = searchParams.get('type') || 'booking'

  const [services] = useState(SERVICES_LIST)
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
    // No longer need fetchServices here
  }, [])

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
        {type === 'booking' ? 'Service Booking' : 'Inquiry Form'}
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
                    <InputLabel>Select Service</InputLabel>
                    <Select
                      value={selectedService}
                      onChange={handleServiceChange}
                      label="Select Service"
                    >
                      {services.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
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
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preferred Date"
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
                  label="Address"
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
                    label="Subject"
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
                  label={type === 'booking' ? 'Problem Description' : 'Message'}
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
                  {loading ? <CircularProgress size={24} /> : (type === 'booking' ? 'Submit Request' : 'Send Inquiry')}
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
