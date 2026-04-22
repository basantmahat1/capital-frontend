import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import apiClient from '../api/apiClient'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  Alert,
  Skeleton,
  Avatar,
  Stack,
  Paper
} from '@mui/material'
import { 
  Build, 
  Computer, 
  Print, 
  NetworkCheck, 
  Code, 
  Security, 
  Memory, 
  Storage, 
  Devices,
  ArrowForward
} from '@mui/icons-material'

const Services = () => {
  const { t } = useTranslation()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/services')
      setServices(response.data)
    } catch (error) {
      console.error('Failed to fetch services:', error)
      setAlert({ type: 'error', message: 'Failed to load services' })
    } finally {
      setLoading(false)
    }
  }

  const getServiceIcon = (category) => {
    const iconStyle = { fontSize: 32 }
    switch (category) {
      case 'computer_repair': return <Computer sx={iconStyle} />
      case 'cctv_installation': return <Security sx={iconStyle} />
      case 'network_setup': return <NetworkCheck sx={iconStyle} />
      case 'web_development': return <Code sx={iconStyle} />
      case 'software_development': return <Memory sx={iconStyle} />
      case 'printer_repair': return <Print sx={iconStyle} />
      default: return <Build sx={iconStyle} />
    }
  }

  const getIconBgColor = (category) => {
    return 'rgba(241, 88, 94, 0.1)'
  }

  const getIconColor = (category) => {
    return '#F1585E'
  }

  const ServiceCard = ({ service }) => (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
          borderColor: '#F1585E'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 4 }}>
        <Avatar 
          sx={{ 
            bgcolor: getIconBgColor(service.category), 
            color: getIconColor(service.category), 
            width: 70, 
            height: 70, 
            mb: 3,
            borderRadius: '16px'
          }}
        >
          {getServiceIcon(service.category)}
        </Avatar>
        <Typography gutterBottom variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
          {service.name}
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mb: 3, lineHeight: 1.7 }}>
          {service.description}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          {service.price && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>
                Starting From
              </Typography>
              <Typography variant="h5" sx={{ color: '#F1585E', fontWeight: 800 }}>
                रू {service.price}
              </Typography>
            </Box>
          )}
          <Button
            component={Link}
            to={`/service-booking?service=${service.id}`}
            variant="contained"
            fullWidth
            endIcon={<ArrowForward />}
            sx={{ 
              borderRadius: '12px', 
              py: 1.5, 
              textTransform: 'none', 
              fontWeight: 700,
              bgcolor: '#1e293b',
              '&:hover': { bgcolor: '#0f172a' }
            }}
          >
            {t('book_now')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box sx={{ bgcolor: '#fff' }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: { xs: 8, md: 10 }, borderBottom: '1px solid #e2e8f0' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography variant="overline" sx={{ color: '#F1585E', fontWeight: 800, letterSpacing: '0.1em' }}>
              OUR SERVICES
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#1e293b', mt: 2, mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              Professional IT Solutions for <Typography component="span" variant="inherit" sx={{ color: '#F1585E' }}>Modern Business</Typography>
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400, mb: 0 }}>
              From hardware repair to custom software development, we provide comprehensive technology services tailored to your needs.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 10 }}>
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 4, borderRadius: '12px' }}>
            {alert.message}
          </Alert>
        )}

        {loading ? (
          <Grid container spacing={4}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '24px' }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <Grid container spacing={4}>
              {services.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <ServiceCard service={service} />
                </Grid>
              ))}
            </Grid>

            {/* Support Banner */}
            <Paper 
              elevation={0}
              sx={{ 
                mt: 12, 
                p: { xs: 4, md: 8 }, 
                borderRadius: '32px', 
                bgcolor: '#1e293b', 
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, zIndex: 0 }}>
                <Grid container spacing={2}>
                  {[...Array(20)].map((_, i) => (
                    <Grid item xs={3} key={i}><Memory sx={{ fontSize: 100 }} /></Grid>
                  ))}
                </Grid>
              </Box>
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
                  Need a Custom Solution?
                </Typography>
                <Typography variant="h6" sx={{ color: '#94a3b8', mb: 5, maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
                  We provide specialized consulting and custom development for complex business requirements. Let's discuss your project.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                  <Button 
                    component={Link}
                    to="/contact"
                    variant="contained" 
                    size="large"
                    sx={{ 
                      bgcolor: '#F1585E', 
                      '&:hover': { bgcolor: '#ef4444' }, 
                      borderRadius: '12px',
                      px: 6,
                      py: 2,
                      fontWeight: 800,
                      textTransform: 'none'
                    }}
                  >
                    Contact Experts
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    sx={{ 
                      color: 'white', 
                      borderColor: 'rgba(255,255,255,0.2)', 
                      borderRadius: '12px',
                      px: 6,
                      py: 2,
                      fontWeight: 800,
                      textTransform: 'none',
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                    }}
                  >
                    View All FAQ
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </>
        )}
      </Container>
    </Box>
  )
}

export default Services
