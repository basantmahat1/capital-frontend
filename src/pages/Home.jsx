import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../services/apiClient'
import {
  Container,
  Typography,
  Grid,
  Box,
  Skeleton
} from '@mui/material'

import Hero from '../components/landing/Hero'
import TrustBar from '../components/landing/TrustBar'
import ServicesLanding from '../components/landing/Services'
import WhyUs from '../components/landing/WhyUs'
import Process from '../components/landing/Process'
import FAQ from '../components/landing/FAQ'
import CTA from '../components/landing/CTA'
import { ProductCard, CategoryCard } from '../components/landing/shop/ProductComponents'
import '../styles/Landing.css'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [bestSellingProducts, setBestSellingProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
    
    // Intersection Observer for reveal animations
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    
    return () => io.disconnect();
  }, [])

const fetchHomeData = async () => {
  try {
    const [featuredRes, bestSellingRes, categoriesRes] = await Promise.all([
      apiClient.get('/products/featured'),
      apiClient.get('/products/best-selling'),
      apiClient.get('/categories')
    ])

    setFeaturedProducts(featuredRes.data.data || [])
    setBestSellingProducts(bestSellingRes.data.data || [])
    setCategories(categoriesRes.data.data || [])
  } catch (error) {
    console.error('Failed to fetch home data:', error)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="landing-page">
      <Hero />
      <TrustBar />
      
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Categories Section */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: { xs: 2, md: 3 }, fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Categories
        </Typography>
        {loading ? (
          <Grid container spacing={{ xs: 1.5, md: 3 }} sx={{ mb: { xs: 4, md: 6 } }}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ mb: { xs: 4, md: 6 } }}>
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={2.4} key={category.id}>
                <Link to={`/products?category=${category.id}`} style={{ textDecoration: 'none' }}>
                  <CategoryCard category={category} />
                </Link>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Featured Products */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: { xs: 2, md: 3 }, fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Featured Products
        </Typography>
        {loading ? (
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 4, md: 6 } }}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Skeleton variant="rectangular" height={300} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 4, md: 6 } }}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Best Selling Products */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: { xs: 2, md: 3 }, fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Best Selling
        </Typography>
        {loading ? (
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 6 }}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Skeleton variant="rectangular" height={300} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 6 }}>
            {bestSellingProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <ServicesLanding />
      <WhyUs />
      <Process />
      <FAQ />
      <CTA />
    </div>
  )
}

export default Home
