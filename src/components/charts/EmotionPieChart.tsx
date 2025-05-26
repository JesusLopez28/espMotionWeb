import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { EmotionStats } from '../../types/emotion-data';
import { Box, Typography, useTheme } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EmotionPieChartProps {
  stats: EmotionStats[];
}

const EmotionPieChart: React.FC<EmotionPieChartProps> = ({ stats }) => {
  const theme = useTheme();
  
  // Mapa de emociones a colores y etiquetas
  const emotionMap = {
    happy: { color: 'rgba(255, 215, 0, 0.8)', label: 'Feliz', icon: '😊' },
    sad: { color: 'rgba(65, 105, 225, 0.8)', label: 'Triste', icon: '😢' },
    fear: { color: 'rgba(153, 102, 255, 0.8)', label: 'Miedo', icon: '😨' },
    neutral: { color: 'rgba(169, 169, 169, 0.8)', label: 'Neutral', icon: '😐' },
    angry: { color: 'rgba(255, 99, 132, 0.8)', label: 'Enojo', icon: '😠' },
    disgust: { color: 'rgba(75, 192, 192, 0.8)', label: 'Disgusto', icon: '🤢' },
    surprise: { color: 'rgba(255, 159, 64, 0.8)', label: 'Sorpresa', icon: '😲' },
  };

  // Agrupar emociones con muy pocos registros como "Otros"
  const total = stats.reduce((sum, stat) => sum + stat.count, 0);
  const threshold = 0.03; // 3% del total
  
  let processedStats = [...stats];
  
  // Si hay datos para procesar
  if (processedStats.length > 0 && total > 0) {
    const significantStats = processedStats.filter(stat => stat.count / total >= threshold);
    const minorStats = processedStats.filter(stat => stat.count / total < threshold);
    
    // Solo combinar en "Otros" si hay más de 1 emoción pequeña
    if (minorStats.length > 1) {
      const otherCount = minorStats.reduce((sum, stat) => sum + stat.count, 0);
      
      // Calcular promedios ponderados para las estadísticas combinadas
      const otherBpm = minorStats.reduce((sum, stat) => sum + stat.avgBpm * stat.count, 0) / otherCount;
      const otherSweating = minorStats.reduce((sum, stat) => sum + stat.avgSweating * stat.count, 0) / otherCount;
      const otherConfidence = minorStats.reduce((sum, stat) => sum + stat.avgConfidence * stat.count, 0) / otherCount;
      
      processedStats = [
        ...significantStats,
        {
          emotion: 'other' as any,
          count: otherCount,
          avgBpm: otherBpm,
          avgSweating: otherSweating,
          avgConfidence: otherConfidence
        }
      ];
      
      // Añadir categoría "Otros" al mapa de emociones
      (emotionMap as any).other = { color: 'rgba(180, 180, 180, 0.7)', label: 'Otros', icon: '✨' };
    }
  }

  const data = {
    labels: processedStats.map(stat => `${(emotionMap as any)[stat.emotion]?.icon || ''} ${(emotionMap as any)[stat.emotion]?.label || stat.emotion}`),
    datasets: [
      {
        data: processedStats.map(stat => stat.count),
        backgroundColor: processedStats.map(stat => (emotionMap as any)[stat.emotion]?.color || 'rgba(180, 180, 180, 0.7)'),
        borderColor: processedStats.map(stat => (emotionMap as any)[stat.emotion]?.color?.replace('0.8', '1') || 'rgba(180, 180, 180, 1)'),
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10
        },
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
        displayColors: true,
        borderWidth: 1,
        borderColor: theme.palette.divider,
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const percent = ((value / total) * 100).toFixed(1);
            return `${value} registros (${percent}%)`;
          }
        }
      }
    },
  };

  // Encontrar la emoción más común
  const dominantEmotion = stats.length > 0 
    ? stats.reduce((prev, current) => (prev.count > current.count) ? prev : current) 
    : null;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2 
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Distribución de Emociones
        </Typography>
        {dominantEmotion && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              backgroundColor: 'rgba(82, 113, 255, 0.1)',
              borderRadius: '20px',
              px: 2,
              py: 0.5,
            }}
          >
            <Typography variant="body2" fontWeight={600} color="primary.main">
              {(emotionMap as any)[dominantEmotion.emotion]?.icon || ''} 
              {' '}Predominante: {(emotionMap as any)[dominantEmotion.emotion]?.label || dominantEmotion.emotion}
            </Typography>
          </Box>
        )}
      </Box>
      
      {stats.length > 0 ? (
        <Box sx={{ flex: 1, position: 'relative', minHeight: '300px' }}>
          <Pie data={data} options={options} />
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
    </Box>
  );
};

export default EmotionPieChart;
