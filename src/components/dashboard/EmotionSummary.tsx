import React from 'react';
import { Paper, Typography, Box, Grid, Chip, LinearProgress } from '@mui/material';
import type { EmotionStats } from '../../types/emotion-data';

interface EmotionSummaryProps {
  stats: EmotionStats[];
}

const EmotionSummary: React.FC<EmotionSummaryProps> = ({ stats }) => {
  // Ordenar las emociones por frecuencia
  const sortedStats = [...stats].sort((a, b) => b.count - a.count);
  const total = sortedStats.reduce((acc, stat) => acc + stat.count, 0);

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: '#FFD700',
      sad: '#4169E1',
      fear: '#9370DB',
      neutral: '#A9A9A9',
      angry: '#FF6347',
      disgust: '#20B2AA',
      surprise: '#FF8C00',
    };

    return colors[emotion] || '#888888';
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Resumen de Emociones
      </Typography>

      {sortedStats.map(stat => {
        const percentage = Math.round((stat.count / total) * 100);

        return (
          <Box key={stat.emotion} sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.5,
              }}
            >
              <Chip
                label={stat.emotion}
                size="small"
                sx={{
                  backgroundColor: getEmotionColor(stat.emotion),
                  color: ['happy', 'surprise'].includes(stat.emotion) ? 'black' : 'white',
                }}
              />
              <Typography variant="body2">
                {stat.count} registros ({percentage}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getEmotionColor(stat.emotion),
                },
              }}
            />
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary">
                  BPM: {stat.avgBpm.toFixed(1)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary">
                  Sudoración: {stat.avgSweating.toFixed(3)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary">
                  Confianza: {(stat.avgConfidence).toFixed(1)}%
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </Paper>
  );
};

export default EmotionSummary;
