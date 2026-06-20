import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F0585E', // Coral Red
    },
    secondary: {
      main: '#0F1B2D', // Dark Navy
    },
    background: {
      default: '#FAFBFA', // Soft White
      paper: '#FAFBFA', // Soft White
    },
    text: {
      primary: '#515457', // Steel Gray
      secondary: '#A8A9A7', // Medium Gray
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2.5rem',
      color: '#0F1B2D',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      color: '#0F1B2D',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      color: '#0F1B2D',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      color: '#0F1B2D',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      color: '#0F1B2D',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      color: '#0F1B2D',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      color: '#515457',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#A8A9A7',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          backgroundColor: '#F0585E', // Coral Red
          color: '#FAFBFA', // Soft White
          '&:hover': {
            backgroundColor: '#E0484E', // Slightly darker Coral Red
          },
        },
        outlined: {
          borderColor: '#D7D3CE', // Light Gray
          color: '#515457', // Steel Gray
          '&:hover': {
            backgroundColor: '#FAFBFA', // Soft White
            borderColor: '#F0585E', // Coral Red
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FAFBFAEB', // Semi-transparent Soft White
          backdropFilter: 'blur(8px)',
          color: '#0F1B2D', // Dark Navy for contrast
          boxShadow: 'none',
          borderBottom: '1px solid #D7D3CE'
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FAFBFA', // Soft White
          border: `1px solid #D7D3CE`, // Light Gray border
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#D7D3CE', // Light Gray
            },
            '&:hover fieldset': {
              borderColor: '#A8A9A7', // Medium Gray
            },
            '&.Mui-focused fieldset': {
              borderColor: '#F0585E', // Coral Red
            },
          },
        },
      },
    },
  },
});
