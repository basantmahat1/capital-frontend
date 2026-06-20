import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box, Chip, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Card 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
              borderColor: '#F1585E'
            }
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="160"
              image={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
            {product.discount_price && (
              <Chip 
                label="SALE" 
                size="small" 
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  left: 8, 
                  bgcolor: '#F1585E', 
                  color: 'white', 
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  height: '18px'
                }} 
              />
            )}
          </Box>
          <CardContent sx={{ flexGrow: 1, p: 1.5, pb: '12px !important' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, mb: 0.2, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
              {product.brand || 'General'}
            </Typography>
            <Typography gutterBottom variant="subtitle1" component="div" sx={{ fontWeight: 700, mb: 1, height: '2.6rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontSize: '0.9rem', lineHeight: 1.2 }}>
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: 800, color: '#F1585E', fontSize: '1rem' }}>
                रू {product.discount_price || product.price}
              </Typography>
              {product.discount_price && (
                <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', fontSize: '0.75rem' }}>
                  रू {product.price}
                </Typography>
              )}
            </Box>
            <Button
              component={Link}
              to={`/products/${product.id}`}
              variant="outlined"
              fullWidth
              size="small"
              sx={{ 
                borderRadius: '6px', 
                textTransform: 'none', 
                fontWeight: 700,
                py: 0.5,
                borderColor: '#e2e8f0',
                color: '#1e293b',
                fontSize: '0.8rem',
                '&:hover': { 
                  borderColor: '#F1585E',
                  bgcolor: 'rgba(241, 88, 94, 0.04)',
                  color: '#F1585E'
                }
              }}
            >
              View
            </Button>
          </CardContent>
        </Card>
    );
};

const CategoryCard = ({ category }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', p: 2 }}>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {category.name}
        </Typography>
      </CardContent>
    </Card>
);

export { ProductCard, CategoryCard };
