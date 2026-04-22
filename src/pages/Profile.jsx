import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { t } = useTranslation()
  const { user, updateProfile } = useAuth()

  const [activeTab, setActiveTab] = useState(0)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      })
    }
  }, [user])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()

    if (!profileData.name || !profileData.email) {
      setAlert({ type: 'error', message: 'Name and email are required' })
      return
    }

    try {
      setLoading(true)
      const result = await updateProfile(profileData)

      if (result.success) {
        setAlert({ type: 'success', message: 'Profile updated successfully' })
      } else {
        setAlert({ type: 'error', message: result.message })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!passwordData.current_password || !passwordData.new_password) {
      setAlert({ type: 'error', message: 'Please fill in all password fields' })
      return
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setAlert({ type: 'error', message: 'New passwords do not match' })
      return
    }

    if (passwordData.new_password.length < 6) {
      setAlert({ type: 'error', message: 'New password must be at least 6 characters' })
      return
    }

    try {
      setLoading(true)
      const result = await updateProfile({ password: passwordData.new_password })

      if (result.success) {
        setAlert({ type: 'success', message: 'Password changed successfully' })
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        })
      } else {
        setAlert({ type: 'error', message: result.message })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('account_settings')}
      </Typography>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label={t('profile')} />
              <Tab label={t('change_password')} />
            </Tabs>
          </Box>

          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box component="form" onSubmit={handleProfileSubmit} sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('personal_information')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('name')}
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('email')}
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                    disabled // Email changes might need verification
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('phone')}
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('address')}
                    name="address"
                    multiline
                    rows={3}
                    value={profileData.address}
                    onChange={handleProfileChange}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : t('save_changes')}
                </Button>
              </Box>
            </Box>
          )}

          {/* Password Tab */}
          {activeTab === 1 && (
            <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('change_password')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('current_password')}
                    name="current_password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('new_password')}
                    name="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('confirm_new_password')}
                    name="confirm_password"
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : t('change_password')}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

export default Profile