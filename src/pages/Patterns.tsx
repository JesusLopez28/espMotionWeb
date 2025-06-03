import React from 'react';
import Layout from '../components/layout/Layout';
import { Box, Typography, CircularProgress, Alert, Paper, useMediaQuery, useTheme } from '@mui/material';
import { useEmotionData } from '../hooks/useEmotionData';

const Patterns: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { loading, error } = useEmotionData({
    realtimeUpdates: true,
    daysBack: 30,
  });

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error al cargar datos: {error.message}
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom sx={{ fontSize: isMobile ? '1.75rem' : '2.125rem' }}>
        Patrones Emocionales
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}
        >
          <Box
            component="img"
            src="/images/pattern-analysis.svg"
            alt="Análisis de patrones"
            sx={{
              width: '100%',
              maxWidth: '300px',
              height: 'auto',
              mb: 3,
              opacity: 0.8
            }}
          />
          
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
            Próximamente
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Esta sección está en desarrollo. Próximamente podrás ver patrones identificados en tus
            emociones, análisis de tendencias y correlaciones con factores externos como horarios,
            actividades y condiciones ambientales.
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Patterns;
