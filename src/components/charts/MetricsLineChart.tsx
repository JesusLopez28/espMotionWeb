import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { EmotionRecord } from '../../types/emotion-data';
import { Box, Typography, useTheme, Chip } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

interface MetricsLineChartProps {
  records: EmotionRecord[];
  metric: 'bpm' | 'sweating';
  title: string;
}

const MetricsLineChart: React.FC<MetricsLineChartProps> = ({ records, metric, title }) => {
  const theme = useTheme();
  
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Limitar a un máximo de 25 puntos para mejor visualización
  const maxPoints = 25;
  const displayRecords = sortedRecords.length > maxPoints 
    ? sortedRecords.filter((_, i) => i % Math.ceil(sortedRecords.length / maxPoints) === 0)
    : sortedRecords;

  // Cálculo de estadísticas
  const values = records.map(record => record[metric]);
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const current = values[0] || 0; // Valor más reciente
  
  // Determinar tendencia
  const recentValues = records.slice(0, Math.min(5, records.length)).map(r => r[metric]);
  const recentAvg = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
  const trend = recentAvg > average ? 'up' : recentAvg < average ? 'down' : 'stable';
  
  // Color y configuración específica para cada métrica
  const metricConfig = {
    bpm: {
      color: theme.palette.secondary.main,
      lightColor: `${theme.palette.secondary.main}20`,
      label: 'Latidos por minuto',
      icon: '❤️',
      unit: 'BPM',
      thresholds: { low: 60, high: 100 },
    },
    sweating: {
      color: theme.palette.primary.main,
      lightColor: `${theme.palette.primary.main}20`,
      label: 'Nivel de sudoración',
      icon: '💧',
      unit: '',
      thresholds: { low: 0.1, high: 0.5 },
    }
  };
  
  const config = metricConfig[metric];
  
  const data = {
    labels: displayRecords.map(record => format(parseISO(record.date), 'HH:mm:ss dd/MM', { locale: es })),
    datasets: [
      {
        label: config.label,
        data: displayRecords.map(record => record[metric]),
        borderColor: config.color,
        backgroundColor: config.color,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: 'white',
        pointBorderColor: config.color,
        pointBorderWidth: 1.5,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: config.color,
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 2,
        tension: 0.3,
        fill: {
          target: 'origin',
          above: config.lightColor,
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        bodyFont: {
          family: "'Poppins', sans-serif",
        },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        displayColors: false,
        borderWidth: 1,
        borderColor: theme.palette.divider,
        callbacks: {
          title: function(tooltipItems: any[]) {
            return format(parseISO(sortedRecords[tooltipItems[0].dataIndex].date), 'PPpp', { locale: es });
          },
          label: function(context: any) {
            const emotion = sortedRecords[context.dataIndex].emotion;
            const value = context.raw;
            const emotionIcons: Record<string, string> = {
              happy: '😊',
              sad: '😢',
              fear: '😨',
              neutral: '😐',
              angry: '😠',
              disgust: '🤢',
              surprise: '😲',
            };
            
            return [
              `${config.label}: ${value}${config.unit}`,
              `Emoción: ${emotionIcons[emotion] || ''} ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}`,
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          },
          color: theme.palette.text.secondary,
        },
      },
      y: {
        beginAtZero: metric === 'sweating', // Para BPM no empezar en cero
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          mb: 2 
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <span>{config.icon}</span> {title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label={`Actual: ${current.toFixed(metric === 'bpm' ? 1 : 3)}${config.unit}`} 
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 500 }} 
          />
          <Chip 
            label={`Prom: ${average.toFixed(metric === 'bpm' ? 1 : 3)}${config.unit}`} 
            size="small" 
            color="secondary"
            sx={{ fontWeight: 500 }} 
          />
          <Chip 
            label={
              trend === 'up' ? '↗️ Subiendo' : 
              trend === 'down' ? '↘️ Bajando' : 
              '→ Estable'
            }
            size="small"
            sx={{ 
              fontWeight: 500,
              bgcolor: 
                trend === 'up' ? 'rgba(255, 87, 87, 0.1)' : 
                trend === 'down' ? 'rgba(82, 113, 255, 0.1)' : 
                'rgba(169, 169, 169, 0.1)',
              color:
                trend === 'up' ? theme.palette.secondary.main : 
                trend === 'down' ? theme.palette.primary.main : 
                theme.palette.text.secondary,
            }} 
          />
        </Box>
      </Box>
      
      {records.length > 0 ? (
        <Box sx={{ flex: 1, position: 'relative', minHeight: '300px' }}>
          <Line options={options} data={data} />
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flex: 1, 
          borderRadius: 2,
          border: `1px dashed ${theme.palette.divider}`,
        }}>
          <Typography variant="body2" color="text.secondary">
            No hay datos suficientes para generar el gráfico
          </Typography>
        </Box>
      )}
      
      {/* Mostrar rangos para la métrica */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Min: {min.toFixed(metric === 'bpm' ? 1 : 3)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Max: {max.toFixed(metric === 'bpm' ? 1 : 3)}
        </Typography>
      </Box>
    </Box>
  );
};

export default MetricsLineChart;
