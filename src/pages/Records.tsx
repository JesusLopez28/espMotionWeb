import React from 'react';
import Layout from '../components/layout/Layout';
import { Box, Typography, CircularProgress, Alert, Snackbar } from '@mui/material';
import EmotionDataTable from '../components/ui/EmotionDataTable';
import { useEmotionData } from '../hooks/useEmotionData';

const Records: React.FC = () => {
  const { records, loading, error } = useEmotionData({ realtimeUpdates: true });
  const [alertOpen, setAlertOpen] = React.useState(Boolean(error));

  React.useEffect(() => {
    if (error) {
      setAlertOpen(true);
    }
  }, [error]);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Registros de Emociones
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <EmotionDataTable records={records} />
      )}

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
          Error al cargar datos: {error?.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Records;
