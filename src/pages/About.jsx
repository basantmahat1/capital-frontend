import { Container, Typography, Box, Grid, Card, CardContent, Paper, Avatar, Stack, Divider, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { 
  Business, 
  Group, 
  Lightbulb, 
  Security, 
  EmojiObjects, 
  RocketLaunch, 
  Verified, 
  AutoGraph,
  ArrowForward
} from '@mui/icons-material'

const About = () => {
  const { t } = useTranslation()

  const values = [
    {
      icon: <Verified sx={{ fontSize: 32, color: '#F1585E' }} />,
      title: 'Integrity',
      description: 'We conduct our business with the highest level of transparency and honesty.'
    },
    {
      icon: <EmojiObjects sx={{ fontSize: 32, color: '#F1585E' }} />,
      title: 'Innovation',
      description: 'We constantly push boundaries to find creative solutions for complex problems.'
    },
    {
      icon: <RocketLaunch sx={{ fontSize: 32, color: '#F1585E' }} />,
      title: 'Excellence',
      description: 'We strive for perfection in every project we undertake and deliver.'
    },
    {
      icon: <AutoGraph sx={{ fontSize: 32, color: '#F1585E' }} />,
      title: 'Growth',
      description: 'We are committed to the continuous growth of our clients and our team.'
    }
  ]

  return (
    <Box sx={{ bgcolor: '#fff' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: '#1e293b', 
          py: { xs: 8, md: 12 }, 
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -100, 
            right: -100, 
            width: 300, 
            height: 300, 
            borderRadius: '50%', 
            bgcolor: 'rgba(241, 88, 94, 0.1)',
            zIndex: 0
          }} 
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800, mb: 2, lineHeight: 1.2, color: 'white' }}>
                Innovating for a <Typography component="span" variant="inherit" sx={{ color: '#F1585E' }}>Digital Future</Typography>
              </Typography>
              <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 400, maxWidth: 600, mb: 4 }}>
                Capital IT Solution is a leading technology partner dedicated to empowering businesses through innovative digital solutions and expert IT services.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 10 }}>
        {/* Story Section */}
        <Grid container spacing={8} alignItems="center" sx={{ mb: 12 }}>
          <Grid item xs={12} md={6}>
            <Box 
              component="img"
              src="https://images.unsplash.com/photo-1522071823991-b9671f9d6f8c?w=800"
              sx={{ 
                width: '100%', 
                borderRadius: '24px', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)' 
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="overline" sx={{ color: '#F1585E', fontWeight: 800, letterSpacing: '0.1em' }}>
              OUR STORY
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mt: 1, mb: 3 }}>
              Built on Passion and Innovation
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontSize: '1.1rem', mb: 3 }}>
              Capital IT Solution was founded with a clear vision: to bridge the gap between traditional business operations and the rapidly evolving digital landscape. Since our inception, we've helped hundreds of businesses transform their operations through technology.
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontSize: '1.1rem' }}>
              We don't just provide services; we build long-term partnerships. Our success is measured by the growth and success of the businesses we serve. We combine technical expertise with a deep understanding of business needs to deliver solutions that truly make a difference.
            </Typography>
          </Grid>
        </Grid>

        {/* Mission & Vision */}
        <Grid container spacing={4} sx={{ mb: 12 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', p: 4, borderRadius: '24px', bgcolor: '#1e293b', color: 'white', border: 'none' }}>
              <Avatar sx={{ bgcolor: 'rgba(241, 88, 94, 0.2)', color: '#F1585E', mb: 3 }}>
                <Lightbulb />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'white' }}>Our Mission</Typography>
              <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '1.1rem' }}>
                To empower businesses of all sizes with innovative technology solutions that drive growth, efficiency, and success in the digital world. We strive to be the catalyst for digital transformation in the region.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'transparent' }}>
              <Avatar sx={{ bgcolor: 'rgba(241, 88, 94, 0.1)', color: '#F1585E', mb: 3 }}>
                <RocketLaunch />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>Our Vision</Typography>
              <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem' }}>
                To become the most trusted technology partner globally, recognized for our commitment to excellence, innovation, and the positive impact we create for our clients and the community.
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Values Section */}
        <Box sx={{ textAlign: 'center', mb: 12 }}>
          <Typography variant="overline" sx={{ color: '#F1585E', fontWeight: 800, letterSpacing: '0.1em' }}>
            CORE VALUES
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mt: 1, mb: 6 }}>
            The Principles We Live By
          </Typography>
          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ 
                  p: 4, 
                  borderRadius: '24px', 
                  border: '1px solid #e2e8f0',
                  transition: '0.3s', 
                  height: '100%',
                  bgcolor: '#fff',
                  '&:hover': { 
                    transform: 'translateY(-10px)', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    borderColor: '#F1585E'
                  } 
                }}>
                  <Avatar sx={{ bgcolor: 'rgba(241, 88, 94, 0.05)', width: 64, height: 64, mx: 'auto', mb: 3 }}>
                    {value.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                    {value.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ CTA Section */}
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f8fafc', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
            Have more questions?
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: 600, mx: 'auto' }}>
            Check out our frequently asked questions to learn more about how we work and how we can help you.
          </Typography>
          <Button
            component={Link}
            to="/faq"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{ 
              bgcolor: '#F1585E', 
              '&:hover': { bgcolor: '#ef4444' }, 
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none'
            }}
          >
            View All FAQ
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default About
