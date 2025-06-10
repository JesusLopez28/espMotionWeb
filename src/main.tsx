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

// Registrar el service worker con manejo mejorado y soporte explícito para móviles
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const { registerSW } = await import('virtual:pwa-register');

      // Registrar con callback para actualizaciones
      const updateSW = registerSW({
        onNeedRefresh() {
          if (confirm('Hay una nueva versión disponible. ¿Actualizar ahora?')) {
            updateSW();
          }
        },
        onOfflineReady() {
          console.log('La aplicación está lista para uso offline');
          // Mostrar una pequeña notificación al usuario
          const offlineToast = document.createElement('div');
          offlineToast.textContent = 'Aplicación lista para uso sin conexión';
          offlineToast.style.position = 'fixed';
          offlineToast.style.bottom = '10px';
          offlineToast.style.left = '50%';
          offlineToast.style.transform = 'translateX(-50%)';
          offlineToast.style.backgroundColor = '#5271ff';
          offlineToast.style.color = 'white';
          offlineToast.style.padding = '10px 20px';
          offlineToast.style.borderRadius = '20px';
          offlineToast.style.zIndex = '9999';
          offlineToast.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          document.body.appendChild(offlineToast);
          
          setTimeout(() => {
            offlineToast.style.opacity = '0';
            offlineToast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
              document.body.removeChild(offlineToast);
            }, 500);
          }, 3000);
        },
        immediate: true,
      });

      console.log('Service Worker registrado correctamente');
    } catch (error) {
      console.error('Error al registrar el Service Worker:', error);
    }
  });
}
