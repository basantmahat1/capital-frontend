import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Box,
  Container
} from '@mui/material'
import {
  ShoppingCart,
  Favorite,
  Person,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Language
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Navbar = ({ darkMode, toggleDarkMode, toggleLanguage }) => {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null)
  }

  const handleLogout = () => {
    logout()
    handleProfileMenuClose()
    navigate('/')
  }

  const menuItems = [
    { text: t('home'), path: '/' },
    { text: t('products'), path: '/products' },
    { text: t('services'), path: '/services' },
    { text: t('about'), path: '/about' },
    { text: t('contact'), path: '/contact' }
  ]

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
            Capital IT Solution
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Button key={item.path} color="inherit" component={Link} to={item.path}>
                {item.text}
              </Button>
            ))}

            {/* Language Toggle */}
            <IconButton color="inherit" onClick={toggleLanguage}>
              <Language />
            </IconButton>

            {/* Dark Mode Toggle */}
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Cart */}
            <IconButton color="inherit" component={Link} to="/cart">
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* Wishlist */}
            <IconButton color="inherit" component={Link} to="/wishlist">
              <Favorite />
            </IconButton>

            {/* User Menu */}
            {user ? (
              <>
                <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                  <Person />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleProfileMenuClose}>
                    {t('profile')}
                  </MenuItem>
                  <MenuItem component={Link} to="/orders" onClick={handleProfileMenuClose}>
                    {t('my_orders')}
                  </MenuItem>
                  {user.role === 'admin' && (
                    <MenuItem component={Link} to="/admin" onClick={handleProfileMenuClose}>
                      {t('admin_panel')}
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    {t('logout')}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  {t('login')}
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  {t('register')}
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" onClick={handleMobileMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
            >
              {menuItems.map((item) => (
                <MenuItem key={item.path} component={Link} to={item.path} onClick={handleMobileMenuClose}>
                  {item.text}
                </MenuItem>
              ))}
              <MenuItem onClick={() => { toggleLanguage(); handleMobileMenuClose() }}>
                <Language sx={{ mr: 1 }} />
                {i18n.language === 'en' ? 'नेपाली' : 'English'}
              </MenuItem>
              <MenuItem onClick={() => { toggleDarkMode(); handleMobileMenuClose() }}>
                {darkMode ? <Brightness7 sx={{ mr: 1 }} /> : <Brightness4 sx={{ mr: 1 }} />}
                {darkMode ? t('light_mode') : t('dark_mode')}
              </MenuItem>
              <MenuItem component={Link} to="/cart" onClick={handleMobileMenuClose}>
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCart sx={{ mr: 1 }} />
                </Badge>
                {t('cart')}
              </MenuItem>
              <MenuItem component={Link} to="/wishlist" onClick={handleMobileMenuClose}>
                <Favorite sx={{ mr: 1 }} />
                {t('wishlist')}
              </MenuItem>
              {user && <MenuItem component={Link} to="/profile" onClick={handleMobileMenuClose}>
                <Person sx={{ mr: 1 }} />
                {t('profile')}
              </MenuItem>}
              {user && <MenuItem component={Link} to="/orders" onClick={handleMobileMenuClose}>
                {t('my_orders')}
              </MenuItem>}
              {user && user.role === 'admin' && (
                <MenuItem component={Link} to="/admin" onClick={handleMobileMenuClose}>
                  {t('admin_panel')}
                </MenuItem>
              )}
              {user && <MenuItem onClick={() => { handleLogout(); handleMobileMenuClose() }}>
                {t('logout')}
              </MenuItem>}
              {!user && <MenuItem component={Link} to="/login" onClick={handleMobileMenuClose}>
                {t('login')}
              </MenuItem>}
              {!user && <MenuItem component={Link} to="/register" onClick={handleMobileMenuClose}>
                {t('register')}
              </MenuItem>}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar