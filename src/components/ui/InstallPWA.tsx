import React, { useState, useEffect } from 'react';
import { Box, Button, Snackbar, Alert, Typography, IconButton, useTheme, useMediaQuery, Paper } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const InstallPWA: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(false);

  // Detectar si es iOS
  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);
  }, []);

  // Detectar si la PWA ya está instalada
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone || 
                         document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setIsInstallable(false);
      return;
    }
    
    // Verificar si el usuario ya descartó la instalación en esta sesión
    const dismissed = sessionStorage.getItem('pwa-install-dismissed') === 'true';
    setInstallDismissed(dismissed);
    
    // Comprobar si la aplicación ya está instalada
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as any).getInstalledRelatedApps().then((apps: any[]) => {
        if (apps.length > 0) {
          setIsInstallable(false);
        }
      }).catch(() => {
        // Si falla, asumimos que podría ser instalable
      });
    }
  }, []);

  // Capturar el evento beforeinstallprompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Mostrar snackbar después de 3 segundos si no está en iOS y no fue descartado
      if (!isIOS && !installDismissed) {
        const timer = setTimeout(() => {
          setShowSnackbar(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [isIOS, installDismissed]);

  // Instalar la PWA
  const handleInstall = async () => {
    if (!installPrompt) return;
    
    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuario aceptó instalar la PWA');
        setIsInstallable(false);
      } else {
        console.log('Usuario rechazó instalar la PWA');
        setInstallDismissed(true);
        sessionStorage.setItem('pwa-install-dismissed', 'true');
      }
    } catch (error) {
      console.error('Error al intentar instalar la PWA:', error);
    } finally {
      setInstallPrompt(null);
      setShowSnackbar(false);
    }
  };

  // Mostrar guía para iOS
  const handleIOSInstall = () => {
    setShowIOSGuide(true);
    setShowSnackbar(false);
  };

  // Cerrar snackbar y guardar preferencia
  const handleClose = () => {
    setShowSnackbar(false);
    setInstallDismissed(true);
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Si no es instalable o ya fue instalada, no mostrar nada
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      {/* Snackbar de promoción de instalación */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={15000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 2 }}
      >
        <Alert
          severity="info"
          icon={<DownloadIcon />}
          action={
            <>
              <Button 
                color="primary" 
                size="small" 
                onClick={isIOS ? handleIOSInstall : handleInstall}
                sx={{ mr: 1, fontWeight: 500 }}
              >
                Instalar
              </Button>
              <IconButton size="small" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
          sx={{ 
            backgroundColor: 'white', 
            color: 'text.primary',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderLeft: `4px solid ${theme.palette.primary.main}`
          }}
        >
          <Typography variant="body2">
            Instala ESP Motion para un acceso más rápido y uso sin conexión
          </Typography>
        </Alert>
      </Snackbar>

      {/* Guía de instalación para iOS */}
      {showIOSGuide && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            p: 2,
          }}
          onClick={() => setShowIOSGuide(false)}
        >
          <Paper
            sx={{
              p: 3,
              maxWidth: '350px',
              width: '100%',
              borderRadius: 3,
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={() => setShowIOSGuide(false)}
            >
              <CloseIcon />
            </IconButton>
            
            <PhoneIphoneIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
            
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Instalar en iOS
            </Typography>
            
            <Box sx={{ textAlign: 'left', mb: 2 }}>
              <Typography variant="body2" paragraph>
                1. Toca el icono <strong>Compartir</strong> <span style={{ fontSize: '1.2em' }}>↑</span> en la barra de Safari
              </Typography>
              <Typography variant="body2" paragraph>
                2. Desplázate y selecciona <AddToHomeScreenIcon sx={{ verticalAlign: 'middle', fontSize: '1.2em' }} /> 
                <strong> Añadir a pantalla de inicio</strong>
              </Typography>
              <Typography variant="body2">
                3. Toca <strong>Añadir</strong> en la parte superior derecha
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={() => setShowIOSGuide(false)}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Entendido
            </Button>
          </Paper>
        </Box>
      )}

      {/* Botón flotante para instalar (visible solo en móvil si no hay snackbar) */}
      {isMobile && !showSnackbar && !installDismissed && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={isIOS ? handleIOSInstall : handleInstall}
            sx={{
              borderRadius: 28,
              py: 1.2,
              px: 2,
              boxShadow: '0 4px 14px rgba(82, 113, 255, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(82, 113, 255, 0.6)',
              },
            }}
          >
            Instalar App
          </Button>
        </Box>
      )}
    </>
  );
};

export default InstallPWA;
