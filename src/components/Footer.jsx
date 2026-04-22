import { Box, Container, Typography, Grid, Link, Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <Box sx={{ bgcolor: '#0F1B2D', color: '#FAFBFA', py: 6, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: '#F0585E', fontWeight: 700, mb: 2 }}>
              Capital IT Solution
            </Typography>
            <Typography variant="body2" sx={{ color: '#A8A9A7', lineHeight: 1.6 }}>
              Your trusted partner for technology solutions in Nepal.
              We provide quality products and excellent IT services with
              professional expertise and customer satisfaction.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" sx={{ color: '#FAFBFA', fontWeight: 600, mb: 2 }}>
              {t('products')}
            </Typography>
            <Link href="/products" sx={{ color: '#A8A9A7', textDecoration: 'none', display: 'block', mb: 1, '&:hover': { color: '#F0585E' } }}>
              {t('mobile')}
            </Link>
            <Link href="/products" sx={{ color: '#A8A9A7', textDecoration: 'none', display: 'block', mb: 1, '&:hover': { color: '#F0585E' } }}>
              {t('laptop')}
            </Link>
            <Link href="/products" sx={{ color: '#A8A9A7', textDecoration: 'none', display: 'block', mb: 1, '&:hover': { color: '#F0585E' } }}>
              {t('cctv')}
            </Link>
            <Link href="/products" sx={{ color: '#A8A9A7', textDecoration: 'none', display: 'block', '&:hover': { color: '#F0585E' } }}>
              {t('accessories')}
            </Link>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" sx={{ color: '#FAFBFA', fontWeight: 600, mb: 2 }}>
              {t('services')}
            </Typography>
            <Link href="/services" sx={{ color: '#A8A9A7', textDecoration: 'none', display: 'block', mb: 1, '&:hover': { color: '#F0585E' } }}>
              {t('computer_repair')}
            </Link>
            <Link href="/services" sx={{ color: '#A8A9A7', textDecoration: 'none', display: 'block', mb: 1, '&:hover': { color: '#F0585E' } }}>
              {t('cctv_installation')}
            </Link>
            <Link href="/services" sx={{ color: '#A8A9A7', textDecoration: 'none', display: 'block', mb: 1, '&:hover': { color: '#F0585E' } }}>
              {t('network_setup')}
            </Link>
            <Link href="/services" sx={{ color: '#A8A9A7', textDecoration: 'none', display: 'block', '&:hover': { color: '#F0585E' } }}>
              {t('website_development')}
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: '#FAFBFA', fontWeight: 600, mb: 2 }}>
              {t('contact')}
            </Typography>
            <Typography variant="body2" sx={{ color: '#A8A9A7', mb: 1, display: 'flex', alignItems: 'center' }}>
              📍 Kathmandu, Nepal
            </Typography>
            <Typography variant="body2" sx={{ color: '#A8A9A7', mb: 1, display: 'flex', alignItems: 'center' }}>
              📞 +977-1-1234567
            </Typography>
            <Typography variant="body2" sx={{ color: '#A8A9A7', mb: 1, display: 'flex', alignItems: 'center' }}>
              ✉️ info@capitalitsolution.com
            </Typography>
            <Typography variant="body2" sx={{ color: '#A8A9A7', display: 'flex', alignItems: 'center' }}>
              🕒 Mon - Sat: 9:00 AM - 6:00 PM
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, bgcolor: '#D7D3CE' }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#A8A9A7' }}>
            © {new Date().getFullYear()} Capital IT Solution. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: '#797875', mt: 1, fontSize: '0.8rem' }}>
            Designed with ❤️ for technology solutions
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer