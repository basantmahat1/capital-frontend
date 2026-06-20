import { Container, Typography, Box, Grid, Card, CardContent, Avatar, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { 
  Lightbulb, 
  RocketLaunch, 
  Verified, 
  AutoGraph,
  EmojiObjects
} from '@mui/icons-material'
import '../styles/Landing.css'

const About = () => {
  const { t } = useTranslation()

  const values = [
    { icon: <Verified />, title: 'Integrity', description: 'Transparency and honesty in every interaction.' },
    { icon: <EmojiObjects />, title: 'Innovation', description: 'Creating cutting-edge solutions for complex IT needs.' },
    { icon: <RocketLaunch />, title: 'Excellence', description: 'Delivering precision in repair and diagnostics.' },
    { icon: <AutoGraph />, title: 'Growth', description: 'Empowering local businesses to scale through technology.' }
  ]

  return (
    <Box sx={{ bgcolor: '#FAFBFA', pt: 10 }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ textAlign: 'center', mb: 10 }}>
        <Typography variant="overline" sx={{ color: '#F0585E', fontWeight: 800, letterSpacing: '0.15em' }}>
          ABOUT CAPITAL I.T SOLUTION
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 800, color: '#0F1B2D', mb: 3 }}>
          Your Trusted Partner in <br /> 
          <Typography component="span" variant="inherit" sx={{ color: '#F0585E' }}>IT Solutions</Typography>
        </Typography>
        <Typography variant="body1" sx={{ color: '#515457', fontSize: '1.2rem', maxWidth: 700, mx: 'auto', mb: 5 }}>
          Based in Butwal Maitri Path, Rupandehi, Nepal, we are committed to providing reliable, fast, and professional IT services, from device repair to enterprise network infrastructure.
        </Typography>
      </Container>

      {/* Story Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box 
              component="img"
              src="https://images.unsplash.com/photo-1581092160607-ee2268157f49?w=800"
              sx={{ width: '100%', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F1B2D', mb: 3 }}>
              Quality You Can Rely On
            </Typography>
            <Typography variant="body1" sx={{ color: '#515457', lineHeight: 1.8, fontSize: '1.1rem', mb: 2 }}>
              Since our founding, Capital I.T Solution has aimed to simplify technology for homes and businesses. We know that downtime is costly, whether it's a personal laptop or a business network.
            </Typography>
            <Typography variant="body1" sx={{ color: '#515457', lineHeight: 1.8, fontSize: '1.1rem' }}>
              Our team consists of certified technicians who are passionate about what they do. We use genuine parts, offer honest diagnostics, and stand behind our work with a 90-day guarantee.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Core Values */}
      <Box sx={{ bgcolor: '#F2F3F1', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 800, color: '#0F1B2D', mb: 8 }}>
            Core Principles
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #D7D3CE', textAlign: 'center', height: '100%' }}>
                  <Avatar sx={{ bgcolor: '#FEF0F0', color: '#F0585E', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                    {value.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F1B2D', mb: 1 }}>{value.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#515457' }}>{value.description}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F1B2D', mb: 3 }}>
            Ready to fix your device?
          </Typography>
          <Button component={Link} to="/contact" variant="contained" size="large" sx={{ bgcolor: '#F0585E', px: 5, py: 1.5, borderRadius: 2, fontWeight: 700 }}>
            Contact Us Today
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default About
