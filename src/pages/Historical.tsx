import React from 'react';
import Layout from '../components/layout/Layout';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import MetricsLineChart from '../components/charts/MetricsLineChart';
import EmotionDistributionChart from '../components/charts/EmotionDistributionChart';
import { useEmotionData } from '../hooks/useEmotionData';

const Historical: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('30');
  const { records, loading, error } = useEmotionData({
    realtimeUpdates: true,
    daysBack: parseInt(timeRange),
  });

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Datos Históricos
        </Typography>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="time-range-label">Período</InputLabel>
          <Select
            labelId="time-range-label"
            id="time-range"
            value={timeRange}
            label="Período"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="7">Última semana</MenuItem>
            <MenuItem value="30">Últimos 30 días</MenuItem>
            <MenuItem value="90">Últimos 3 meses</MenuItem>
            <MenuItem value="365">Último año</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MetricsLineChart
            records={records.slice(0, 100)}
            metric="bpm"
            title="Historial de Latidos Cardíacos"
          />
        </Grid>
        <Grid item xs={12}>
          <MetricsLineChart
            records={records.slice(0, 100)}
            metric="sweating"
            title="Historial de Nivel de Sudoración"
          />
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribución de emociones en el tiempo
            </Typography>
            <Box sx={{ height: 400, mt: 2 }}>
              <EmotionDistributionChart records={records} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Historical;
