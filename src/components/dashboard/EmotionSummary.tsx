import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  useTheme, 
  useMediaQuery,
  LinearProgress,
  Chip,
  Divider
} from '@mui/material';
import type { EmotionStats } from '../../types/emotion-data';

interface EmotionSummaryProps {
  stats: EmotionStats[];
}

const EmotionSummary: React.FC<EmotionSummaryProps> = ({ stats }) => {
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

  // Mapear emociones a íconos
  const emotionIcons: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    fear: '😨',
    neutral: '😐',
    angry: '😠',
    disgust: '🤢',
    surprise: '😲',
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

  // Calcular el total para los porcentajes
  const totalCount = stats.reduce((sum, stat) => sum + stat.count, 0);

  // Ordenar las estadísticas por conteo (mayor a menor)
  const sortedStats = [...stats].sort((a, b) => b.count - a.count);

  return (
    <Paper
      sx={{
        p: isMobile ? 2 : 3,
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
      }}
      elevation={0}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, 
          mb: 2,
          fontSize: isMobile ? '1rem' : '1.25rem',
          textAlign: isMobile ? 'center' : 'left'
        }}
      >
        Resumen de Emociones
      </Typography>

      {stats.length > 0 ? (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <List disablePadding sx={{ '& .MuiListItem-root': { px: 0, py: 1 } }}>
            {sortedStats.map((stat, index) => {
              const percentage = totalCount > 0 ? (stat.count / totalCount) * 100 : 0;
              
              return (
                <React.Fragment key={stat.emotion}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon sx={{ minWidth: isMobile ? 36 : 44 }}>
                      <Box 
                        sx={{ 
                          fontSize: isMobile ? '1.5rem' : '2rem', 
                          lineHeight: 1,
                          textAlign: 'center',
                          width: '100%'
                        }}
                      >
                        {emotionIcons[stat.emotion] || '😶'}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600, 
                              fontSize: isMobile ? '0.875rem' : '1rem',
                              textTransform: 'capitalize' 
                            }}
                          >
                            {emotionLabels[stat.emotion] || stat.emotion}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={`${Math.round(percentage)}%`}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                backgroundColor: `${emotionColors[stat.emotion]}20` || '#88888820',
                                color: emotionColors[stat.emotion] || '#888888',
                                height: 24,
                                minWidth: 45
                              }}
                            />
                            {!isMobile && (
                              <Typography variant="body2" sx={{ fontWeight: 500, width: 36, textAlign: 'right' }}>
                                {stat.count}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              mb: 0.5,
                              backgroundColor: `${emotionColors[stat.emotion]}10` || '#88888810',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: emotionColors[stat.emotion] || '#888888',
                              }
                            }}
                          />
                          
                          {!isMobile && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                BPM: {stat.avgBpm.toFixed(1)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Sudoración: {stat.avgSweating.toFixed(3)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Confianza: {(stat.avgConfidence).toFixed(1)}%
                              </Typography>
                            </Box>
                          )}
                          
                          {isMobile && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                BPM: {stat.avgBpm.toFixed(1)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Confianza: {(stat.avgConfidence).toFixed(1)}%
                              </Typography>
                            </Box>
                          )}
                        </>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItem>
                  {index < sortedStats.length - 1 && <Divider component="li" sx={{ my: 0.5 }} />}
                </React.Fragment>
              );
            })}
          </List>
        </Box>
      ) : (
        <Box 
          sx={{ 
            flex: 1,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: 2,
            border: `1px dashed ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No hay datos suficientes para mostrar el resumen
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default EmotionSummary;
