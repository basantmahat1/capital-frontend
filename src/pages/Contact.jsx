import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Typography, Box, Grid, TextField, Button, Paper, Stack, IconButton, Link as MuiLink } from '@mui/material'
import { Phone, WhatsApp, Email, LocationOn, AccessTime } from '@mui/icons-material'
import '../styles/Landing.css'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <Box sx={{ bgcolor: '#FAFBFA', py: 10 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: '#F0585E', fontWeight: 800, letterSpacing: '0.15em' }}>
            GET IN TOUCH
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#0F1B2D', mb: 2 }}>
            Let's Talk Technology
          </Typography>
          <Typography variant="body1" sx={{ color: '#515457', fontSize: '1.2rem', maxWidth: 600, mx: 'auto' }}>
            Have a question or need a repair? Our team is ready to help you with expert IT solutions.
          </Typography>
        </Box>

        <Grid container spacing={8}>
          {/* Quick Action Buttons */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, borderRadius: 4, mb: 4, bgcolor: '#0F1B2D', color: 'white' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Need immediate help?</Typography>
              <Stack spacing={2}>
                <Button 
                  startIcon={<Phone />} 
                  variant="contained" 
                  size="large" 
                  href="tel:+977XXXXXXXXXX"
                  sx={{ bgcolor: '#F0585E', '&:hover': { bgcolor: '#E0484E' }, py: 1.5, borderRadius: 2, fontWeight: 700 }}
                >
                  Call Now
                </Button>
                <Button 
                  startIcon={<WhatsApp />} 
                  variant="outlined" 
                  size="large" 
                  href="https://wa.me/977XXXXXXXXXX"
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', py: 1.5, borderRadius: 2, fontWeight: 700, '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  WhatsApp Us
                </Button>
              </Stack>
            </Paper>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOn sx={{ color: '#F0585E' }} />
                <Typography variant="body1" sx={{ color: '#515457' }}>Butwal Maitri Path, Rupandehi, Nepal</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Email sx={{ color: '#F0585E' }} />
                <MuiLink href="mailto:info@techfixpro.com.np" sx={{ color: '#515457', textDecoration: 'none', '&:hover': { color: '#F0585E' } }}>info@techfixpro.com.np</MuiLink>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccessTime sx={{ color: '#F0585E' }} />
                <Typography variant="body1" sx={{ color: '#515457' }}>Sun–Fri: 9AM – 7PM</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 5, borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F1B2D', mb: 3 }}>Send us a Message</Typography>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <TextField fullWidth label="Name" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <TextField fullWidth label="Email" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <TextField fullWidth label="Subject" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                <TextField fullWidth label="Message" multiline rows={4} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} onChange={(e) => setFormData({...formData, message: e.target.value})} required />
                <Button type="submit" variant="contained" size="large" sx={{ bgcolor: '#F0585E', py: 1.5, borderRadius: 2, fontWeight: 700, '&:hover': { bgcolor: '#E0484E' } }}>
                  Send Message
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Contact
