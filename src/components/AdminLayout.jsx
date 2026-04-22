import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Container,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  ListItemButton,
  CssBaseline
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductIcon,
  ShoppingCart as OrderIcon,
  People as UserIcon,
  Build as ServiceIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  NotificationsNone as NotificationIcon,
  AdminPanelSettings as AdminIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'

const drawerWidth = 260

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
  { text: 'Products', icon: <ProductIcon />, path: '/admin/products' },
  { text: 'Orders', icon: <OrderIcon />, path: '/admin/orders' },
  { text: 'Users', icon: <UserIcon />, path: '/admin/users' },
  { text: 'Services', icon: <ServiceIcon />, path: '/admin/services' }
]

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [open, setOpen] = useState(!isMobile)

  useEffect(() => {
    setOpen(!isMobile)
  }, [isMobile])

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e293b', color: 'white' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#F1585E', width: 36, height: 36 }}>
          <AdminIcon sx={{ fontSize: 20 }} />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: '1rem' }}>
            Capital IT
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
            Solution Admin
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }} />

      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path || 
                        (item.path.includes('?') && location.pathname + location.search === item.path)
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => isMobile && setOpen(false)}
                sx={{
                  borderRadius: '10px',
                  py: 1,
                  px: 2,
                  bgcolor: active ? '#F1585E' : 'transparent',
                  color: active ? 'white' : '#94a3b8',
                  '&:hover': {
                    bgcolor: active ? '#F1585E' : 'rgba(255,255,255,0.05)',
                    color: 'white'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem', 
                    fontWeight: active ? 700 : 500 
                  }} 
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Box sx={{ p: 1.5 }}>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '10px',
            color: '#94a3b8',
            py: 1,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#ef4444' }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
            <LogoutIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { lg: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { lg: `${open ? drawerWidth : 0}px` },
          bgcolor: 'white',
          borderBottom: '1px solid #e2e8f0',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 }, minHeight: 64 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: '#64748b' }}
          >
            {open && !isMobile ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <IconButton sx={{ color: '#64748b' }}>
              <NotificationIcon sx={{ fontSize: 22 }} />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 20, alignSelf: 'center' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" sx={{ color: '#1e293b', fontWeight: 700, lineHeight: 1, fontSize: '0.85rem' }}>
                  {user?.name || 'Admin'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.75rem' }}>
                  Administrator
                </Typography>
              </Box>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: '#F1585E',
                  boxShadow: '0 0 0 3px #fee2e2'
                }}
              >
                {user?.name?.charAt(0) || 'A'}
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { lg: open ? drawerWidth : 0 }, flexShrink: { lg: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={open}
          onClose={handleDrawerToggle}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              boxShadow: '10px 0 15px -3px rgba(0,0,0,0.05)'
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { lg: `calc(100% - ${open ? drawerWidth : 0}px)` },
          mt: '64px',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 0 } }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default AdminLayout
