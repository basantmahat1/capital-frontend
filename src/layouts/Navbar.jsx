import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  Menu as MenuIcon
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const { user, logout, openAuthModal } = useAuth()
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
    { text: 'Home', path: '/' },
    { text: 'Products', path: '/products' },
    { text: 'Services', path: '/services' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' }
  ]

  return (
    <AppBar position="static" sx={{ backgroundColor: '#F0585E' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ py: { xs: 1, md: 1 }, minHeight: { xs: '60px', md: '70px' } }}>
          <Box component={Link} to="/" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '50px', borderRadius: '50%', border: '2px solid white' }} />
            <Typography variant="h6" sx={{ ml: 2, fontWeight: 700, color: 'white', display: { xs: 'none', sm: 'block' } }}>
              Capital I.T Solution
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', '& .MuiButton-root': { color: 'white' }, '& .MuiIconButton-root': { color: 'white' } }}>
            {menuItems.map((item) => (
              <Button key={item.path} component={Link} to={item.path}>
                {item.text}
              </Button>
            ))}

            {/* Cart */}
            <IconButton component={Link} to="/cart">
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* Wishlist */}
            <IconButton component={Link} to="/wishlist">
              <Favorite />
            </IconButton>

            {/* User Menu */}
            {user ? (
              <>
                <IconButton onClick={handleProfileMenuOpen}>
                  <Person />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleProfileMenuClose}>
                    Profile
                  </MenuItem>
                  <MenuItem component={Link} to="/orders" onClick={handleProfileMenuClose}>
                    My Orders
                  </MenuItem>
                  {user.role === 'admin' && (
                    <MenuItem component={Link} to="/admin" onClick={handleProfileMenuClose}>
                      Admin Panel
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button onClick={() => openAuthModal('login')}>
                  Login
                </Button>
                <Button onClick={() => openAuthModal('register')}>
                  Register
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
              <MenuItem component={Link} to="/cart" onClick={handleMobileMenuClose}>
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCart sx={{ mr: 1 }} />
                </Badge>
                Cart
              </MenuItem>
              <MenuItem component={Link} to="/wishlist" onClick={handleMobileMenuClose}>
                <Favorite sx={{ mr: 1 }} />
                Wishlist
              </MenuItem>
              {user && <MenuItem component={Link} to="/profile" onClick={handleMobileMenuClose}>
                <Person sx={{ mr: 1 }} />
                Profile
              </MenuItem>}
              {user && <MenuItem component={Link} to="/orders" onClick={handleMobileMenuClose}>
                My Orders
              </MenuItem>}
              {user && user.role === 'admin' && (
                <MenuItem component={Link} to="/admin" onClick={handleMobileMenuClose}>
                  Admin Panel
                </MenuItem>
              )}
              {user && <MenuItem onClick={() => { handleLogout(); handleMobileMenuClose() }}>
                Logout
              </MenuItem>}
              {!user && <MenuItem onClick={() => { openAuthModal('login'); handleMobileMenuClose() }}>
                Login
              </MenuItem>}
              {!user && <MenuItem onClick={() => { openAuthModal('register'); handleMobileMenuClose() }}>
                Register
              </MenuItem>}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
