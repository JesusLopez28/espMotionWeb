import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { EmotionStats } from '../../types/emotion-data';
import { Box, Paper, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EmotionPieChartProps {
  stats: EmotionStats[];
}

const EmotionPieChart: React.FC<EmotionPieChartProps> = ({ stats }) => {
  const emotionColors = {
    happy: 'rgba(255, 206, 86, 0.7)',
    sad: 'rgba(54, 162, 235, 0.7)',
    fear: 'rgba(153, 102, 255, 0.7)',
    neutral: 'rgba(201, 203, 207, 0.7)',
    angry: 'rgba(255, 99, 132, 0.7)',
    disgust: 'rgba(75, 192, 192, 0.7)',
    surprise: 'rgba(255, 159, 64, 0.7)',
  };

  const data = {
    labels: stats.map(stat => stat.emotion),
    datasets: [
      {
        data: stats.map(stat => stat.count),
        backgroundColor: stats.map(stat => emotionColors[stat.emotion]),
        borderColor: stats.map(stat => emotionColors[stat.emotion].replace('0.7', '1')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Distribución de Emociones
      </Typography>
      <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
        <Pie data={data} options={options} />
      </Box>
    </Paper>
  );
};

export default EmotionPieChart;
