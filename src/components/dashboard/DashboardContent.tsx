import React from 'react';
import { Grid, Box, Typography, CircularProgress, Alert, useTheme, Paper, Chip, useMediaQuery } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import OpacityIcon from '@mui/icons-material/Opacity';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import PercentIcon from '@mui/icons-material/Percent';

import StatCard from '../ui/StatCard';
import EmotionPieChart from '../charts/EmotionPieChart';
import MetricsLineChart from '../charts/MetricsLineChart';
import EmotionSummary from './EmotionSummary';
import { useEmotionData } from '../../hooks/useEmotionData';
import FirebaseDebug from './FirebaseDebug';

const DashboardContent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { records, stats, loading, error } = useEmotionData({
    realtimeUpdates: true,
    limitCount: 50,
  });

  // Función para obtener información sobre estados emocionales
  const getEmotionInfo = (emotion: string) => {
    const emotionInfo: Record<string, {
      description: string,
      icon: string,
      color: string,
      tipText: string
    }> = {
      happy: {
        description: "Estado de ánimo optimista y agradable",
        icon: "😊",
        color: "#FFD700",
        tipText: "La felicidad está asociada a una mejor salud cardiovascular"
      },
      sad: {
        description: "Estado de ánimo melancólico o pesimista",
        icon: "😢",
        color: "#4169E1",
        tipText: "La tristeza es una emoción natural que ayuda a procesar pérdidas"
      },
      fear: {
        description: "Respuesta ante amenazas percibidas",
        icon: "😨",
        color: "#9370DB",
        tipText: "El miedo activa respuestas fisiológicas de protección"
      },
      neutral: {
        description: "Estado emocional equilibrado",
        icon: "😐",
        color: "#A9A9A9",
        tipText: "El estado neutral permite mayor objetividad en decisiones"
      },
      angry: {
        description: "Estado de irritación o hostilidad",
        icon: "😠",
        color: "#FF6347",
        tipText: "El enojo controlado puede motivar cambios positivos"
      },
      disgust: {
        description: "Aversión hacia algo desagradable",
        icon: "🤢",
        color: "#20B2AA",
        tipText: "El disgusto evolucionó como mecanismo de protección ante toxinas"
      },
      surprise: {
        description: "Reacción ante eventos inesperados",
        icon: "😲",
        color: "#FF8C00",
        tipText: "La sorpresa aumenta la atención y memoria a corto plazo"
      }
    };
    
    return emotionInfo[emotion] || {
      description: "Estado emocional",
      icon: "😶",
      color: "#888888",
      tipText: "Las emociones influyen en nuestra salud física y mental"
    };
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="70vh"
        flexDirection="column"
        gap={3}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
          Analizando datos emocionales...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <>
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2, 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            '& .MuiAlert-icon': { alignItems: 'center' }
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Error al cargar datos
          </Typography>
          <Typography variant="body2">
            {error.message}
          </Typography>
        </Alert>
        <FirebaseDebug />
      </>
    );
  }

  if (records.length === 0) {
    return (
      <Box sx={{ my: 4 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 3,
            backgroundColor: 'rgba(82, 113, 255, 0.03)',
            border: '1px dashed rgba(82, 113, 255, 0.3)',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            No hay registros disponibles
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 4, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            No se encontraron registros en la base de datos. Verifica la conexión con Firebase
            y que la colección 'emotion_data' contenga documentos.
          </Typography>

          <FirebaseDebug />
        </Paper>
      </Box>
    );
  }

  // Calcular la emoción predominante
  const dominantEmotion = stats.sort((a, b) => b.count - a.count)[0];
  const emotionInfo = getEmotionInfo(dominantEmotion?.emotion || 'neutral');

  // Calcular promedios
  const avgBpm = records.reduce((sum, record) => sum + record.bpm, 0) / records.length;
  const avgSweating = records.reduce((sum, record) => sum + record.sweating, 0) / records.length;
  const avgConfidence =
    records.reduce((sum, record) => sum + record.confidence, 0) / records.length;

  // Tendencia BPM (últimas 10 lecturas)
  const recentBpmAvg = records.slice(0, 10).reduce((sum, record) => sum + record.bpm, 0) / 
    Math.min(10, records.length);
  const bpmTrend = recentBpmAvg > avgBpm ? "↗️" : recentBpmAvg < avgBpm ? "↘️" : "→";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: { xs: 1, sm: 2 } 
      }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            mb: 1, 
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`, 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>
            Dashboard de Emociones
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitoreo y análisis en tiempo real
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, mt: { xs: 1, sm: 0 } }}>
          <Chip 
            label="Tiempo real" 
            color="primary" 
            size="small" 
            sx={{ fontWeight: 500, borderRadius: 2 }} 
          />
          <Chip 
            label={`${records.length} registros`} 
            color="secondary"
            variant="outlined" 
            size="small" 
            sx={{ fontWeight: 500, borderRadius: 2 }} 
          />
        </Box>
      </Box>

      {/* Card con la emoción predominante - más compacta en móvil */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 4, 
          borderRadius: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: { xs: 2, md: 3 },
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(82, 113, 255, 0.05) 100%)`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Box 
          sx={{ 
            width: { xs: 60, md: 100 }, 
            height: { xs: 60, md: 100 }, 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: { xs: '2rem', md: '4rem' },
            background: `linear-gradient(135deg, ${emotionInfo.color}30 0%, ${emotionInfo.color}60 100%)`,
            boxShadow: `0 5px 15px ${emotionInfo.color}40`,
            alignSelf: { xs: 'center', md: 'flex-start' }
          }}
        >
          {emotionInfo.icon}
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 1.5 }}>
            EMOCIÓN PREDOMINANTE
          </Typography>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            mb: 1, 
            color: emotionInfo.color, 
            textTransform: 'capitalize',
            fontSize: { xs: '1.5rem', md: '2.125rem' }
          }}>
            {dominantEmotion?.emotion || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ 
            maxWidth: 600,
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}>
            {emotionInfo.description}. <strong>{emotionInfo.tipText}</strong>
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexDirection: { xs: 'row', md: 'column' },
          alignItems: { xs: 'center', md: 'flex-end' },
          alignSelf: { xs: 'center', md: 'flex-start' },
          mt: { xs: 1, md: 0 }
        }}>
          <Chip 
            label={`${dominantEmotion?.count || 0} ocurrencias`} 
            size="small" 
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 500 }} 
          />
          <Chip 
            label={`BPM: ${dominantEmotion?.avgBpm.toFixed(1) || 0}`} 
            size="small" 
            color="secondary" 
            sx={{ fontWeight: 500 }} 
          />
        </Box>
      </Paper>

      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Tarjetas de estadísticas - en móvil mostramos 2 por fila */}
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="BPM Promedio"
            value={avgBpm.toFixed(1)}
            subtitle={`Tendencia: ${bpmTrend}`}
            icon={<FavoriteIcon fontSize={isMobile ? "small" : "medium"} />}
            color="#FF5757"
            animation="pulse 1.5s infinite ease-in-out"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Sudoración"
            value={avgSweating.toFixed(3)}
            subtitle="Nivel GSR"
            icon={<OpacityIcon fontSize={isMobile ? "small" : "medium"} />}
            color="#5271FF"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Emoción Principal"
            value={dominantEmotion?.emotion || 'N/A'}
            subtitle={`${emotionInfo.icon} ${dominantEmotion?.count || 0}`}
            icon={<EmojiEmotionsIcon fontSize={isMobile ? "small" : "medium"} />}
            color={emotionInfo.color}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Confianza"
            value={`${(avgConfidence).toFixed(1)}%`}
            subtitle="Precisión"
            icon={<PercentIcon fontSize={isMobile ? "small" : "medium"} />}
            color="#66BB6A"
          />
        </Grid>

        {/* Gráficas - En móvil, apilamos verticalmente */}
        <Grid item xs={12} md={6} sx={{ '& > div': { height: isMobile ? '300px' : '100%' } }}>
          <Box className="chart-container">
            <EmotionPieChart stats={stats} />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6} sx={{ '& > div': { height: isMobile ? 'auto' : '100%' } }}>
          <EmotionSummary stats={stats} />
        </Grid>
        
        <Grid item xs={12} md={6} sx={{ '& > div': { height: isMobile ? '300px' : '100%' } }}>
          <Box className="chart-container">
            <MetricsLineChart 
              records={records} 
              metric="bpm" 
              title="Tendencia de Latidos Cardíacos"
              compactMode={isMobile}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6} sx={{ '& > div': { height: isMobile ? '300px' : '100%' } }}>
          <Box className="chart-container">
            <MetricsLineChart
              records={records}
              metric="sweating"
              title="Tendencia de Nivel de Sudoración"
              compactMode={isMobile}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardContent;
