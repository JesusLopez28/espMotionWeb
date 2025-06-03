import React from 'react';
import Layout from '../components/layout/Layout';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

import { useEmotionData } from '../hooks/useEmotionData';
import EmotionPieChart from '../components/charts/EmotionPieChart';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('7');
  const { stats, loading, error } = useEmotionData({
    realtimeUpdates: true,
    daysBack: parseInt(timeRange),
  });

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  // Calcular métricas por emoción
  const metricsByEmotion = React.useMemo(() => {
    if (!stats.length) return [];

    return stats.map(stat => ({
      emotion: stat.emotion,
      count: stat.count,
      avgBpm: stat.avgBpm,
      avgSweating: stat.avgSweating,
      avgConfidence: stat.avgConfidence,
      // Calcular correlaciones
      bpmToSweatingRatio: stat.avgBpm / (stat.avgSweating || 1),
    }));
  }, [stats]);

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
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">Análisis de Emociones</Typography>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="time-range-label">Período</InputLabel>
          <Select
            labelId="time-range-label"
            id="time-range"
            value={timeRange}
            label="Período"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="1">1 día</MenuItem>
            <MenuItem value="7">7 días</MenuItem>
            <MenuItem value="30">30 días</MenuItem>
            <MenuItem value="90">90 días</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <EmotionPieChart stats={stats} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Estadísticas Detalladas
            </Typography>

            <Box sx={{ mt: 2 }}>
              {stats.map(stat => (
                <Box key={stat.emotion} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    {stat.emotion}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Ocurrencias: {stat.count}</Typography>
                    <Typography variant="body2">BPM Promedio: {stat.avgBpm.toFixed(1)}</Typography>
                    <Typography variant="body2">
                      Sudoración: {stat.avgSweating.toFixed(3)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Insights
          </Typography>
        </Grid>

        {metricsByEmotion.map(metric => (
          <Grid item xs={12} sm={6} md={4} key={metric.emotion}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ textTransform: 'capitalize', mb: 2 }}>
                  {metric.emotion}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Esta emoción fue detectada {metric.count} veces.
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Durante este estado emocional, el promedio de latidos del corazón fue de{' '}
                  {metric.avgBpm.toFixed(1)} BPM y el nivel de sudoración promedio fue de{' '}
                  {metric.avgSweating.toFixed(3)}.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nivel de confianza promedio: {metric.avgConfidence.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default Analytics;
