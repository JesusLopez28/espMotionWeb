import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Tema personalizado con colores emocionales
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5271ff', // Azul más vibrante que representa calma
      light: '#8e9eff',
      dark: '#0047cb',
    },
    secondary: {
      main: '#ff5757', // Rojo que representa emoción/pasión
      light: '#ff897c',
      dark: '#c31432',
    },
    background: {
      default: '#f8f9fd',
      paper: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ffb74d', // Naranja más suave
    },
    info: {
      main: '#64b5f6', // Azul claro para neutral
    },
    success: {
      main: '#66bb6a', // Verde para felicidad
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 14px 0 rgba(32, 40, 86, 0.06)',
        },
        elevation1: {
          boxShadow: '0 2px 14px 0 rgba(32, 40, 86, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 3px 15px 0 rgba(32, 40, 86, 0.08)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 6px 20px 0 rgba(32, 40, 86, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// Registrar el service worker de la PWA (solo en producción)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    import('virtual:pwa-register').then(({ registerSW }) => {
      registerSW();
    });
  });
}
