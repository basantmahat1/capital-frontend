import { useState } from 'react'
import { Container, Typography, Box, Grid, Card, CardContent, TextField, Button, Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { LocationOn, Phone, Email, AccessTime } from '@mui/icons-material'

const Contact = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  const contactInfo = [
    {
      icon: <LocationOn sx={{ fontSize: 30, color: '#F1585E' }} />,
      title: 'Address',
      details: ['Capital IT Solution', 'Kathmandu, Nepal']
    },
    {
      icon: <Phone sx={{ fontSize: 30, color: '#F1585E' }} />,
      title: 'Phone',
      details: ['+977-XXXXXXXXXX', '+977-XXXXXXXXXX']
    },
    {
      icon: <Email sx={{ fontSize: 30, color: '#F1585E' }} />,
      title: 'Email',
      details: ['info@capitalitsolution.com', 'support@capitalitsolution.com']
    },
    {
      icon: <AccessTime sx={{ fontSize: 30, color: '#F1585E' }} />,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 9:00 AM - 2:00 PM']
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#1e293b', fontWeight: 800 }}>
          Contact Us
        </Typography>
        <Typography variant="h5" sx={{ color: '#64748b', maxWidth: 600, mx: 'auto' }}>
          Get in touch with us for any inquiries or support
        </Typography>
      </Box>

      <Grid container spacing={6}>
        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1e293b', fontWeight: 700, mb: 4 }}>
            Get In Touch
          </Typography>

          <Grid container spacing={3}>
            {contactInfo.map((info, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      {info.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1e293b', fontWeight: 600 }}>
                      {info.title}
                    </Typography>
                    {info.details.map((detail, idx) => (
                      <Typography key={idx} variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                        {detail}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1e293b', fontWeight: 700, mb: 4 }}>
            Send us a Message
          </Typography>

          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      mt: 2,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Contact