import React from 'react';
import { Paper, Typography, Box, Grid, Chip, LinearProgress, useTheme, Tooltip } from '@mui/material';
import type { EmotionStats } from '../../types/emotion-data';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import OpacityOutlinedIcon from '@mui/icons-material/OpacityOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

interface EmotionSummaryProps {
  stats: EmotionStats[];
}

const EmotionSummary: React.FC<EmotionSummaryProps> = ({ stats }) => {
  const theme = useTheme();
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
  
  const getEmotionIcon = (emotion: string) => {
    const emotionIcons: Record<string, React.ReactNode> = {
      happy: '😊',
      sad: '😢',
      fear: '😨',
      neutral: '😐',
      angry: '😠',
      disgust: '🤢',
      surprise: '😲',
    };
    
    return emotionIcons[emotion] || '';
  };
  
  const getEmotionLabel = (emotion: string) => {
    const labels: Record<string, string> = {
      happy: 'Feliz',
      sad: 'Triste',
      fear: 'Miedo',
      neutral: 'Neutral',
      angry: 'Enojo',
      disgust: 'Disgusto',
      surprise: 'Sorpresa',
    };

    return labels[emotion] || emotion;
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        height: '100%', 
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
      elevation={0}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 600, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span>Resumen de Emociones</span>
        <Chip 
          label={`${total} registros`} 
          size="small" 
          sx={{ 
            backgroundColor: 'rgba(82, 113, 255, 0.1)', 
            color: theme.palette.primary.main,
            fontWeight: 500
          }} 
        />
      </Typography>

      <Box sx={{ mt: 3 }}>
        {sortedStats.map(stat => {
          const percentage = Math.round((stat.count / total) * 100);
          const color = getEmotionColor(stat.emotion);

          return (
            <Box key={stat.emotion} sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span>{getEmotionIcon(stat.emotion)}</span>
                        <span>{getEmotionLabel(stat.emotion)}</span>
                      </Box>
                    }
                    size="small"
                    sx={{
                      backgroundColor: `${color}30`,
                      color: stat.emotion === 'happy' || stat.emotion === 'surprise' ? '#000000' : color,
                      fontWeight: 500,
                      border: `1px solid ${color}40`,
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {stat.count} ({percentage}%)
                </Typography>
              </Box>
              
              <Tooltip title={`${percentage}% de las detecciones`} arrow placement="top">
                <Box sx={{ position: 'relative' }}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgba(0,0,0,0.06)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: color,
                        borderRadius: 5,
                      },
                    }}
                  />
                  
                  {/* Indicadores de severidad en la barra */}
                  {percentage > 50 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -6,
                        left: `50%`,
                        height: 22,
                        width: 2,
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        zIndex: 1,
                      }}
                    />
                  )}
                </Box>
              </Tooltip>
              
              <Grid container spacing={1} sx={{ mt: 0.5 }}>
                <Grid item xs={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FavoriteOutlinedIcon sx={{ color: theme.palette.secondary.main, fontSize: '0.875rem' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {stat.avgBpm.toFixed(1)} BPM
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <OpacityOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: '0.875rem' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {stat.avgSweating.toFixed(3)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <VerifiedOutlinedIcon sx={{ color: theme.palette.success.main, fontSize: '0.875rem' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {(stat.avgConfidence).toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          );
        })}
        
        {stats.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No hay datos disponibles para mostrar
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default EmotionSummary;
