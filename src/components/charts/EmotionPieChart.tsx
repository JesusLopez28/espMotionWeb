import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import type { EmotionStats } from '../../types/emotion-data';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EmotionPieChartProps {
  stats: EmotionStats[];
}

const EmotionPieChart: React.FC<EmotionPieChartProps> = ({ stats }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Mapear nombres de emociones a nombres en español
  const emotionLabels: Record<string, string> = {
    happy: 'Feliz',
    sad: 'Triste',
    fear: 'Miedo',
    neutral: 'Neutral',
    angry: 'Enojo',
    disgust: 'Disgusto',
    surprise: 'Sorpresa',
  };

  // Mapear emociones a colores
  const emotionColors: Record<string, string> = {
    happy: '#FFD700',
    sad: '#4169E1',
    fear: '#9370DB',
    neutral: '#A9A9A9',
    angry: '#FF6347',
    disgust: '#20B2AA',
    surprise: '#FF8C00',
  };

  // Preparar datos para el gráfico
  const chartData: ChartData<'pie'> = useMemo(() => {
    return {
      labels: stats.map(stat => emotionLabels[stat.emotion] || stat.emotion),
      datasets: [
        {
          data: stats.map(stat => stat.count),
          backgroundColor: stats.map(stat => emotionColors[stat.emotion] || '#888888'),
          borderColor: stats.map(stat => `${emotionColors[stat.emotion]}90` || '#77777790'),
          borderWidth: 1,
          hoverOffset: 15,
        },
      ],
    };
  }, [stats]);

  // Opciones del gráfico
  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'right',
        align: 'center',
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: isMobile ? 10 : 12,
          },
          boxWidth: isMobile ? 12 : 15,
          padding: isMobile ? 10 : 15,
          textAlign: 'left',
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        bodyFont: {
          family: "'Poppins', sans-serif",
        },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        borderWidth: 1,
        borderColor: theme.palette.divider,
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce((acc: number, data: number) => acc + data, 0);
            const value = dataset.data[tooltipItem.dataIndex] as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '40%',
    radius: '85%',
    layout: {
      padding: {
        top: isMobile ? 5 : 10,
        bottom: isMobile ? 5 : 10,
        left: isMobile ? 5 : 10,
        right: isMobile ? 5 : 10,
      },
    },
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          fontSize: isMobile ? '1rem' : '1.25rem',
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        Distribución de Emociones
      </Typography>

      {stats.length > 0 ? (
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Pie data={chartData} options={options} />
        </Box>
      ) : (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            border: `1px dashed ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No hay datos suficientes para mostrar la distribución
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EmotionPieChart;
