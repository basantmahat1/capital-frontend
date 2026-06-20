import { Modal, Box, Typography, Button, TextField, IconButton, Fade, Divider, Alert } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { isAuthModalOpen, authModalMode, openAuthModal, closeAuthModal, login, register } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // Clear alert and form when modal opens/closes or switches mode
  useEffect(() => {
    setAlert(null);
    setFormData({ email: '', password: '', name: '' });
  }, [isAuthModalOpen, authModalMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (authModalMode === 'login') {
      if (!formData.email || !formData.password) {
        setAlert({ type: 'error', message: 'Please fill in all fields' });
        return;
      }

      try {
        setLoading(true);
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          if (result.details && Array.isArray(result.details) && result.details.length > 0) {
            setAlert({ type: 'error', message: result.details[0].msg });
          } else {
            setAlert({ type: 'error', message: result.message || 'Login failed' });
          }
        }
      } catch (err) {
        setAlert({ type: 'error', message: 'Something went wrong. Please try again.' });
      } finally {
        setLoading(false);
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setAlert({ type: 'error', message: 'Please fill in all fields' });
        return;
      }

      try {
        setLoading(true);
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        if (!result.success) {
          if (result.details && Array.isArray(result.details) && result.details.length > 0) {
            setAlert({ type: 'error', message: result.details[0].msg });
          } else {
            setAlert({ type: 'error', message: result.message || 'Registration failed' });
          }
        }
      } catch (err) {
        setAlert({ type: 'error', message: 'Something went wrong. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal open={isAuthModalOpen} onClose={closeAuthModal} closeAfterTransition>
      <Fade in={isAuthModalOpen}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 450 }, 
          bgcolor: 'rgba(250, 251, 250, 0.95)', // Semi-transparent background
          backdropFilter: 'blur(12px)', // Frosted glass effect
          p: 4, borderRadius: 4,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(215, 211, 206, 0.5)',
          outline: 'none', display: 'flex', flexDirection: 'column', gap: 2
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F1B2D' }}>
              {authModalMode === 'login' ? 'Login' : 'Register'}
            </Typography>
            <IconButton onClick={closeAuthModal} sx={{ color: '#0F1B2D', '&:hover': { transform: 'rotate(90deg)', transition: '0.3s' } }}>
              <Close />
            </IconButton>
          </Box>

          {alert && (
            <Alert severity={alert.type} sx={{ mb: 1, borderRadius: 2 }}>
              {alert.message}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {authModalMode === 'register' && (
              <TextField fullWidth label="Name" value={formData.name} required variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            )}
            <TextField fullWidth label="Email" type="email" value={formData.email} required variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <TextField fullWidth type="password" label="Password" value={formData.password} required variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            
            <Button fullWidth variant="contained" type="submit" size="large" disabled={loading} sx={{ 
              py: 1.5, fontSize: '1rem', fontWeight: 700, borderRadius: 2, mt: 1,
              bgcolor: '#F0585E', '&:hover': { bgcolor: '#E0484E' }
            }}>
              {loading ? 'Processing...' : (authModalMode === 'login' ? 'Login' : 'Register')}
            </Button>
          </form>

          <Divider sx={{ borderColor: 'rgba(215, 211, 206, 0.5)' }}>Or</Divider>

          <Button onClick={() => openAuthModal(authModalMode === 'login' ? 'register' : 'login')} 
            variant="text" sx={{ color: '#0F1B2D', fontWeight: 600, '&:hover': { bgcolor: 'rgba(240, 88, 94, 0.05)' } }}>
            {authModalMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AuthModal;
