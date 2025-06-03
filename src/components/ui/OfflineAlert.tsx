import React from 'react';
import { Alert, Snackbar, Box, Typography, Paper, useTheme } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface OfflineAlertProps {
  fullscreenFallback?: boolean;
}

const OfflineAlert: React.FC<OfflineAlertProps> = ({ fullscreenFallback = false }) => {
  const { isOnline, recentlyChanged } = useOnlineStatus();
  const theme = useTheme();

  // Si estamos en línea y no hubo cambio reciente, no mostrar nada
  if (isOnline && !recentlyChanged) {
    return null;
  }

  // Snackbar para notificaciones de cambio de estado
  if (recentlyChanged) {
    return (
      <Snackbar
        open={true}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 6 }}
      >
        <Alert 
          severity={isOnline ? 'success' : 'warning'} 
          variant="filled"
          icon={isOnline ? undefined : <WifiOffIcon />}
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          }}
        >
          {isOnline ? 'Conexión restablecida' : 'Sin conexión a Internet'}
        </Alert>
      </Snackbar>
    );
  }

  // Si estamos offline y se solicitó un fallback en pantalla completa
  if (!isOnline && fullscreenFallback) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'background.default',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            maxWidth: 500,
            borderRadius: 4,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }}
        >
          <CloudOffIcon sx={{ fontSize: 80, color: theme.palette.warning.main, mb: 2 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Sin conexión a Internet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            ESP Motion está funcionando en modo offline. Algunas funciones pueden no estar disponibles hasta que se restablezca la conexión.
          </Typography>
          <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
            La aplicación intentará reconectar automáticamente cuando haya conexión disponible.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Alerta simple para estado offline (cuando no se pide fullscreen)
  if (!isOnline) {
    return (
      <Alert
        severity="warning"
        icon={<WifiOffIcon />}
        sx={{
          width: '100%',
          mb: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="body2">
          Sin conexión a Internet. Los datos pueden no estar actualizados.
        </Typography>
      </Alert>
    );
  }

  return null;
};

export default OfflineAlert;
