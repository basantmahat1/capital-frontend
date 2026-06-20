import { Box, Container, Typography, Grid, Link, Divider, IconButton, Stack } from '@mui/material'
import { Facebook, Instagram, WhatsApp, YouTube } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

const Footer = () => {
  const { t } = useTranslation()

  const socialLinks = [
    { icon: <Facebook />, url: '#' },
    { icon: <Instagram />, url: '#' },
    { icon: <YouTube />, url: '#' }, // Using YouTube as TikTok icon placeholder
    { icon: <WhatsApp />, url: '#' }
  ]

  return (
    <Box sx={{ bgcolor: '#0F1B2D', color: '#FAFBFA', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', mb: 2, textDecoration: 'none' }}>
              <img src="/logo.png" alt="Logo" style={{ height: '70px', borderRadius: '50%', border: '2px solid white' }} />
              <Typography variant="h6" sx={{ ml: 2, fontWeight: 700, color: '#F0585E' }}>
                Capital I.T Solution
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#A8A9A7', lineHeight: 1.8, mb: 3 }}>
              Your trusted technology partner in Butwal. We specialize in fast, professional IT repairs and network solutions.
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social, index) => (
                <IconButton key={index} href={social.url} sx={{ color: '#FAFBFA', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#F0585E' } }}>
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Company</Typography>
            {['home', 'about', 'contact'].map((item) => (
              <Link key={item} component={RouterLink} to={item === 'home' ? '/' : `/${item}`} sx={{ color: '#A8A9A7', display: 'block', mb: 1, textDecoration: 'none', '&:hover': { color: '#F0585E' } }}>
                {t(item)}
              </Link>
            ))}
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Shop</Typography>
            {['products', 'cart', 'wishlist'].map((item) => (
              <Link key={item} component={RouterLink} to={`/${item}`} sx={{ color: '#A8A9A7', display: 'block', mb: 1, textDecoration: 'none', '&:hover': { color: '#F0585E' } }}>
                {t(item)}
              </Link>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Contact Info</Typography>
            <Typography variant="body2" sx={{ color: '#A8A9A7', mb: 1 }}>📍 Butwal Maitri Path, Rupandehi, Nepal</Typography>
            <Link href="tel:+977XXXXXXXXXX" sx={{ color: '#A8A9A7', mb: 1, display: 'block', textDecoration: 'none', '&:hover': { color: '#F0585E' } }}>📞 +977-XXXXXXXXXX</Link>
            <Link href="mailto:info@techfixpro.com.np" sx={{ color: '#A8A9A7', mb: 1, display: 'block', textDecoration: 'none', '&:hover': { color: '#F0585E' } }}>✉️ info@techfixpro.com.np</Link>
          </Grid>
        </Grid>
        
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        
        <Typography variant="body2" sx={{ color: '#797875', textAlign: 'center', mt: 4 }}>
          © {new Date().getFullYear()} Capital IT Solution. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer
