import React from 'react';
import Layout from '../components/layout/Layout';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useEmotionData } from '../hooks/useEmotionData';

const Patterns: React.FC = () => {
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
      <Typography variant="h4" gutterBottom>
        Patrones Emocionales
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body1">
          Esta sección está en desarrollo. Próximamente podrás ver patrones identificados en tus
          emociones.
        </Typography>
      </Box>
    </Layout>
  );
};

export default Patterns;
