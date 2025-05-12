import React from 'react';
import { Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import OpacityIcon from '@mui/icons-material/Opacity';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import PercentIcon from '@mui/icons-material/Percent';

import StatCard from '../ui/StatCard';
import EmotionPieChart from '../charts/EmotionPieChart';
import MetricsLineChart from '../charts/MetricsLineChart';
import EmotionSummary from './EmotionSummary';
import { useEmotionData } from '../../hooks/useEmotionData';

const DashboardContent: React.FC = () => {
  const { records, stats, loading, error } = useEmotionData({
    realtimeUpdates: true,
    limitCount: 50,
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error al cargar datos: {error.message}
      </Alert>
    );
  }

  if (records.length === 0) {
    return (
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h5">No hay registros disponibles</Typography>
      </Box>
    );
  }

  // Calcular la emoción predominante
  const dominantEmotion = stats.sort((a, b) => b.count - a.count)[0];

  // Calcular promedios
  const avgBpm = records.reduce((sum, record) => sum + record.bpm, 0) / records.length;
  const avgSweating = records.reduce((sum, record) => sum + record.sweating, 0) / records.length;
  const avgConfidence =
    records.reduce((sum, record) => sum + record.confidence, 0) / records.length;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard de Emociones
      </Typography>

      <Grid container spacing={3}>
        {/* Tarjetas de estadísticas */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="BPM Promedio"
            value={avgBpm.toFixed(1)}
            icon={<FavoriteIcon />}
            color="#FF6384"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sudoración Promedio"
            value={avgSweating.toFixed(3)}
            icon={<OpacityIcon />}
            color="#36A2EB"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Emoción Predominante"
            value={dominantEmotion?.emotion || 'N/A'}
            icon={<EmojiEmotionsIcon />}
            color="#FFCE56"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Confianza Promedio"
            value={`${(avgConfidence * 100).toFixed(1)}%`}
            icon={<PercentIcon />}
            color="#4BC0C0"
          />
        </Grid>

        {/* Gráficas */}
        <Grid item xs={12} md={6}>
          <EmotionPieChart stats={stats} />
        </Grid>
        <Grid item xs={12} md={6}>
          <EmotionSummary stats={stats} />
        </Grid>
        <Grid item xs={12} md={6}>
          <MetricsLineChart records={records} metric="bpm" title="Tendencia de Latidos Cardíacos" />
        </Grid>
        <Grid item xs={12} md={6}>
          <MetricsLineChart
            records={records}
            metric="sweating"
            title="Tendencia de Nivel de Sudoración"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardContent;
