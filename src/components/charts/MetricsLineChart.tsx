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
} from 'chart.js';
import type { EmotionRecord } from '../../types/emotion-data';
import { Box, Paper, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MetricsLineChartProps {
  records: EmotionRecord[];
  metric: 'bpm' | 'sweating';
  title: string;
}

const MetricsLineChart: React.FC<MetricsLineChartProps> = ({ records, metric, title }) => {
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const data = {
    labels: sortedRecords.map(record => format(parseISO(record.date), 'HH:mm:ss dd/MM')),
    datasets: [
      {
        label: metric === 'bpm' ? 'Latidos por minuto' : 'Nivel de sudoración',
        data: sortedRecords.map(record => record[metric]),
        borderColor: metric === 'bpm' ? 'rgb(255, 99, 132)' : 'rgb(53, 162, 235)',
        backgroundColor: metric === 'bpm' ? 'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height: 300 }}>
        <Line options={options} data={data} />
      </Box>
    </Paper>
  );
};

export default MetricsLineChart;
