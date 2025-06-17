import React, { useMemo } from 'react';
import Layout from '../components/layout/Layout';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  useMediaQuery,
  useTheme,
  Grid,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useEmotionData } from '../hooks/useEmotionData';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScrollableContainer from '../components/ui/ScrollableContainer';
import { parseISO, isAfter, subDays } from 'date-fns';

// Componente para mostrar patrones de emociones por día de la semana
const DayOfWeekPatterns: React.FC<{ data: any[]; isMobile: boolean; isTablet: boolean }> = ({
  data,
  isMobile,
  isTablet,
}) => {
  const theme = useTheme();

  const emotionColors: Record<string, string> = {
    happy: '#FFD700',
    sad: '#4169E1',
    fear: '#9370DB',
    neutral: '#A9A9A9',
    angry: '#FF6347',
    disgust: '#20B2AA',
    surprise: '#FF8C00',
  };

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        height: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <CardContent sx={{ height: '100%', p: isMobile ? 1.5 : isTablet ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarMonthIcon
            sx={{
              mr: 1,
              color: theme.palette.primary.main,
              fontSize: isMobile ? '1.2rem' : '1.5rem',
            }}
          />
          <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600}>
            Patrones por Día de Semana
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {data.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {dayNames.map((day, index) => {
              const dayData = data.find(d => d.dayIndex === index);
              const emotions = dayData?.emotions || [];
              const maxCount = Math.max(...emotions.map((e: { count: any }) => e.count), 1);

              return (
                <Box key={day} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography
                      variant={isMobile ? 'body2' : 'subtitle2'}
                      fontWeight={500}
                      sx={{
                        width: isMobile ? 70 : isTablet ? 85 : 100,
                        color: dayData && dayData.total > 0 ? 'text.primary' : 'text.disabled',
                      }}
                    >
                      {day}
                    </Typography>

                    {!isMobile && dayData && dayData.total > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        {dayData.total} registros
                      </Typography>
                    )}
                  </Box>

                  {dayData && dayData.total > 0 ? (
                    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                      {emotions
                        .sort((a: { count: number }, b: { count: number }) => b.count - a.count)
                        .map(
                          (emotion: {
                            name: React.Key | null | undefined;
                            label: any;
                            count: number;
                          }) => (
                            <Chip
                              key={emotion.name}
                              label={`${emotion.label} ${Math.round((emotion.count / dayData.total) * 100)}%`}
                              size={isMobile ? 'small' : 'medium'}
                              sx={{
                                backgroundColor: `${emotionColors[String(emotion.name) as keyof typeof emotionColors] ?? '#A9A9A9'}20`,
                                color:
                                  emotionColors[
                                    String(emotion.name) as keyof typeof emotionColors
                                  ] ?? '#A9A9A9',
                                fontWeight: 500,
                                width:
                                  (emotion.count / maxCount) *
                                  (isMobile ? 120 : isTablet ? 150 : 200),
                                minWidth: isMobile ? 70 : 80,
                                fontSize: isMobile ? '0.7rem' : '0.8125rem',
                                height: isMobile ? 24 : 32,
                              }}
                            />
                          )
                        )}
                    </Box>
                  ) : (
                    <Typography
                      variant={isMobile ? 'caption' : 'body2'}
                      color="text.disabled"
                      sx={{ fontStyle: 'italic' }}
                    >
                      No hay datos
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
              p: isMobile ? 1 : 3,
            }}
          >
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color="text.secondary"
              align="center"
            >
              No hay suficientes datos para mostrar patrones por día de la semana
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Componente para mostrar patrones de emociones por hora del día
const HourlyPatterns: React.FC<{ data: any[]; isMobile: boolean; isTablet: boolean }> = ({
  data,
  isMobile,
  isTablet,
}) => {
  const theme = useTheme();

  const emotionColors: Record<string, string> = {
    happy: '#FFD700',
    sad: '#4169E1',
    fear: '#9370DB',
    neutral: '#A9A9A9',
    angry: '#FF6347',
    disgust: '#20B2AA',
    surprise: '#FF8C00',
  };

  // Agrupar en 4 segmentos del día
  const timeSegments = [
    { name: 'Mañana', range: 'De 6:00 a 11:59', hours: [6, 7, 8, 9, 10, 11] },
    { name: 'Tarde', range: 'De 12:00 a 17:59', hours: [12, 13, 14, 15, 16, 17] },
    { name: 'Noche', range: 'De 18:00 a 23:59', hours: [18, 19, 20, 21, 22, 23] },
    { name: 'Madrugada', range: 'De 0:00 a 5:59', hours: [0, 1, 2, 3, 4, 5] },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        height: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <CardContent sx={{ height: '100%', p: isMobile ? 1.5 : isTablet ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTimeIcon
            sx={{
              mr: 1,
              color: theme.palette.primary.main,
              fontSize: isMobile ? '1.2rem' : '1.5rem',
            }}
          />
          <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600}>
            Patrones por Hora del Día
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {data.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {timeSegments.map(segment => {
              // Filtrar los datos para este segmento de tiempo
              const segmentData = data.filter(d => segment.hours.includes(d.hour));
              const totalInSegment = segmentData.reduce((sum, item) => sum + item.total, 0);

              // Combinar emociones de todas las horas en este segmento
              const emotionCounts: Record<string, { name: string; label: string; count: number }> =
                {};

              segmentData.forEach(hourData => {
                hourData.emotions.forEach(
                  (emotion: { name: string | number; label: any; count: number }) => {
                    if (!emotionCounts[emotion.name]) {
                      emotionCounts[emotion.name] = {
                        name: String(emotion.name),
                        label: emotion.label,
                        count: 0,
                      };
                    }
                    emotionCounts[emotion.name].count += emotion.count;
                  }
                );
              });

              const emotions = Object.values(emotionCounts).sort((a, b) => b.count - a.count);
              const maxCount = emotions.length > 0 ? Math.max(...emotions.map(e => e.count), 1) : 1;

              return (
                <Box key={segment.name}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant={isMobile ? 'body1' : 'subtitle1'}
                      fontWeight={600}
                      color={theme.palette.primary.main}
                    >
                      {segment.name}
                    </Typography>
                    <Typography variant={isMobile ? 'caption' : 'body2'} color="text.secondary">
                      {segment.range} • {totalInSegment} registros
                    </Typography>
                  </Box>

                  {totalInSegment > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      {emotions.map(emotion => (
                        <Box key={emotion.name} sx={{ mb: 0.75 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                            <Typography variant={isMobile ? 'caption' : 'body2'}>
                              {emotion.label}
                            </Typography>
                            <Typography variant={isMobile ? 'caption' : 'body2'} fontWeight={600}>
                              {Math.round((emotion.count / totalInSegment) * 100)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(emotion.count / maxCount) * 100}
                            sx={{
                              height: isMobile ? 6 : 8,
                              borderRadius: 4,
                              backgroundColor: `${emotionColors[emotion.name]}20`,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: emotionColors[emotion.name],
                              },
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      variant={isMobile ? 'caption' : 'body2'}
                      color="text.disabled"
                      sx={{ fontStyle: 'italic' }}
                    >
                      No hay datos para este período
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
              p: isMobile ? 1 : 3,
            }}
          >
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color="text.secondary"
              align="center"
            >
              No hay suficientes datos para mostrar patrones por hora del día
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Componente para mostrar correlaciones entre métricas y emociones
const CorrelationsTable: React.FC<{ data: any[]; isMobile: boolean; isTablet: boolean }> = ({
  data,
  isMobile,
  isTablet,
}) => {
  const theme = useTheme();

  const emotionIcons: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    fear: '😨',
    neutral: '😐',
    angry: '😠',
    disgust: '🤢',
    surprise: '😲',
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        height: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <CardContent sx={{ height: '100%', p: isMobile ? 1.5 : isTablet ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CompareArrowsIcon
            sx={{
              mr: 1,
              color: theme.palette.primary.main,
              fontSize: isMobile ? '1.2rem' : '1.5rem',
            }}
          />
          <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600}>
            Correlaciones
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {data.length > 0 ? (
          <ScrollableContainer maxHeight={isMobile ? '300px' : isTablet ? '350px' : '450px'}>
            <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
              <Table size={isMobile ? 'small' : 'medium'} sx={{ minWidth: isMobile ? 280 : 350 }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        padding: isMobile ? '6px 8px' : '16px',
                      }}
                    >
                      Emoción
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        padding: isMobile ? '6px 8px' : '16px',
                      }}
                    >
                      BPM
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        padding: isMobile ? '6px 8px' : '16px',
                      }}
                    >
                      Sudoración
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        padding: isMobile ? '6px 8px' : '16px',
                      }}
                    >
                      Confianza
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(row => (
                    <TableRow
                      key={row.emotion}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          textTransform: 'capitalize',
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          padding: isMobile ? '6px 8px' : '16px',
                        }}
                      >
                        <span>{emotionIcons[row.emotion] || '😶'}</span>
                        {row.label}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          color:
                            row.bpmDelta > 5
                              ? theme.palette.error.main
                              : row.bpmDelta < -5
                                ? theme.palette.success.main
                                : 'inherit',
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          padding: isMobile ? '6px 8px' : '16px',
                        }}
                      >
                        {row.avgBpm.toFixed(1)}
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            ml: 0.5,
                            color:
                              row.bpmDelta > 0
                                ? theme.palette.error.main
                                : row.bpmDelta < 0
                                  ? theme.palette.success.main
                                  : 'inherit',
                            fontSize: isMobile ? '0.65rem' : '0.7rem',
                          }}
                        >
                          {row.bpmDelta > 0
                            ? `+${row.bpmDelta.toFixed(1)}`
                            : row.bpmDelta.toFixed(1)}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          color:
                            row.sweatingDelta > 0.05
                              ? theme.palette.error.main
                              : row.sweatingDelta < -0.05
                                ? theme.palette.success.main
                                : 'inherit',
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          padding: isMobile ? '6px 8px' : '16px',
                        }}
                      >
                        {row.avgSweating.toFixed(3)}
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            ml: 0.5,
                            color:
                              row.sweatingDelta > 0
                                ? theme.palette.error.main
                                : row.sweatingDelta < 0
                                  ? theme.palette.success.main
                                  : 'inherit',
                            fontSize: isMobile ? '0.65rem' : '0.7rem',
                          }}
                        >
                          {row.sweatingDelta > 0
                            ? `+${row.sweatingDelta.toFixed(3)}`
                            : row.sweatingDelta.toFixed(3)}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          padding: isMobile ? '6px 8px' : '16px',
                        }}
                      >
                        {row.avgConfidence.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ScrollableContainer>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
              p: isMobile ? 1 : 3,
            }}
          >
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color="text.secondary"
              align="center"
            >
              No hay suficientes datos para mostrar correlaciones
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Componente para mostrar tendencias emocionales
const EmotionTrends: React.FC<{ data: any[]; isMobile: boolean; isTablet: boolean }> = ({
  data,
  isMobile,
  isTablet,
}) => {
  const theme = useTheme();

  const emotionColors: Record<string, string> = {
    happy: '#FFD700',
    sad: '#4169E1',
    fear: '#9370DB',
    neutral: '#A9A9A9',
    angry: '#FF6347',
    disgust: '#20B2AA',
    surprise: '#FF8C00',
  };

  const emotionIcons: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    fear: '😨',
    neutral: '😐',
    angry: '😠',
    disgust: '🤢',
    surprise: '😲',
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        height: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <CardContent sx={{ height: '100%', p: isMobile ? 1.5 : isTablet ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUpIcon
            sx={{
              mr: 1,
              color: theme.palette.primary.main,
              fontSize: isMobile ? '1.2rem' : '1.5rem',
            }}
          />
          <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600}>
            Tendencias Recientes
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {data.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.map((trend, index) => (
              <Box key={index} sx={{ mb: 1.5 }}>
                <Typography
                  variant={isMobile ? 'body1' : 'subtitle1'}
                  fontWeight={600}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}
                >
                  <span>{emotionIcons[trend.emotion] || '😶'}</span>
                  {trend.label}
                  <Chip
                    label={trend.direction === 'up' ? 'Aumentando' : 'Disminuyendo'}
                    size="small"
                    color={trend.direction === 'up' ? 'primary' : 'secondary'}
                    sx={{
                      ml: 0.5,
                      fontWeight: 500,
                      height: isMobile ? 20 : 24,
                      fontSize: isMobile ? '0.65rem' : '0.75rem',
                    }}
                  />
                </Typography>

                <Typography
                  variant={isMobile ? 'caption' : 'body2'}
                  color="text.secondary"
                  sx={{ mb: 1.5 }}
                >
                  {trend.description}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: isMobile ? 1 : 1.5,
                    borderRadius: 2,
                    bgcolor: `${emotionColors[trend.emotion]}10`,
                    border: `1px solid ${emotionColors[trend.emotion]}30`,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontSize={isMobile ? '0.65rem' : '0.75rem'}
                    >
                      Desde hace 7 días
                    </Typography>
                    <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight={600}>
                      {trend.previousPercentage}%
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      color:
                        trend.direction === 'up'
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                      fontWeight: 'bold',
                      fontSize: isMobile ? '1.2rem' : '1.5rem',
                    }}
                  >
                    {trend.direction === 'up' ? '→' : '→'}
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontSize={isMobile ? '0.65rem' : '0.75rem'}
                    >
                      Últimos 2 días
                    </Typography>
                    <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight={600}>
                      {trend.currentPercentage}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
              p: isMobile ? 1 : 3,
            }}
          >
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color="text.secondary"
              align="center"
            >
              No hay suficientes datos para mostrar tendencias emocionales
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const Patterns: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [timeRange, setTimeRange] = React.useState('30');

  const { records, stats, loading, error } = useEmotionData({
    realtimeUpdates: true,
    daysBack: parseInt(timeRange),
  });

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  // Mapeo de etiquetas en español para las emociones
  const emotionLabels: Record<string, string> = {
    happy: 'Feliz',
    sad: 'Triste',
    fear: 'Miedo',
    neutral: 'Neutral',
    angry: 'Enojo',
    disgust: 'Disgusto',
    surprise: 'Sorpresa',
  };

  // Procesar datos para análisis por día de la semana
  const dayOfWeekData = useMemo(() => {
    if (!records.length) return [];

    const dayData: Record<
      number,
      {
        dayIndex: number;
        total: number;
        emotions: { name: string; label: string; count: number }[];
      }
    > = {};

    // Inicializar datos para cada día
    for (let i = 0; i < 7; i++) {
      dayData[i] = {
        dayIndex: i,
        total: 0,
        emotions: [],
      };
    }

    // Procesar registros
    records.forEach(record => {
      const date = parseISO(record.date);
      const dayIndex = date.getDay(); // 0 = domingo, 1 = lunes, ...

      // Incrementar contador para este día
      dayData[dayIndex].total += 1;

      // Actualizar contadores de emociones
      const existingEmotion = dayData[dayIndex].emotions.find(e => e.name === record.emotion);
      if (existingEmotion) {
        existingEmotion.count += 1;
      } else {
        dayData[dayIndex].emotions.push({
          name: record.emotion,
          label: emotionLabels[record.emotion] || record.emotion,
          count: 1,
        });
      }
    });

    return Object.values(dayData);
  }, [records]);

  // Procesar datos para análisis por hora del día
  const hourlyData = useMemo(() => {
    if (!records.length) return [];

    const hours: Record<
      number,
      {
        hour: number;
        total: number;
        emotions: { name: string; label: string; count: number }[];
      }
    > = {};

    // Inicializar datos para cada hora
    for (let i = 0; i < 24; i++) {
      hours[i] = {
        hour: i,
        total: 0,
        emotions: [],
      };
    }

    // Procesar registros
    records.forEach(record => {
      const date = parseISO(record.date);
      const hour = date.getHours();

      // Incrementar contador para esta hora
      hours[hour].total += 1;

      // Actualizar contadores de emociones
      const existingEmotion = hours[hour].emotions.find(e => e.name === record.emotion);
      if (existingEmotion) {
        existingEmotion.count += 1;
      } else {
        hours[hour].emotions.push({
          name: record.emotion,
          label: emotionLabels[record.emotion] || record.emotion,
          count: 1,
        });
      }
    });

    return Object.values(hours);
  }, [records]);

  // Calcular correlaciones entre métricas fisiológicas y emociones
  const correlationData = useMemo(() => {
    if (!stats.length) return [];

    // Calcular promedios globales para usar como punto de referencia
    const globalAvgBpm = records.reduce((sum, r) => sum + r.bpm, 0) / records.length;
    const globalAvgSweating = records.reduce((sum, r) => sum + r.sweating, 0) / records.length;

    return stats.map(stat => ({
      emotion: stat.emotion,
      label: emotionLabels[stat.emotion] || stat.emotion,
      avgBpm: stat.avgBpm,
      avgSweating: stat.avgSweating,
      avgConfidence: stat.avgConfidence,
      bpmDelta: stat.avgBpm - globalAvgBpm,
      sweatingDelta: stat.avgSweating - globalAvgSweating,
    }));
  }, [stats, records]);

  // Calcular tendencias emocionales recientes
  const trendData = useMemo(() => {
    if (!records.length) return [];

    const now = new Date();
    const twoDaysAgo = subDays(now, 2);
    const sevenDaysAgo = subDays(now, 7);

    // Separar registros recientes y anteriores
    const recentRecords = records.filter(r => isAfter(parseISO(r.date), twoDaysAgo));
    const previousRecords = records.filter(
      r => !isAfter(parseISO(r.date), twoDaysAgo) && isAfter(parseISO(r.date), sevenDaysAgo)
    );

    if (recentRecords.length < 5 || previousRecords.length < 5) {
      return [];
    }

    // Contar ocurrencias de cada emoción en cada período
    const recentCounts: Record<string, number> = {};
    const previousCounts: Record<string, number> = {};

    recentRecords.forEach(r => {
      recentCounts[r.emotion] = (recentCounts[r.emotion] || 0) + 1;
    });

    previousRecords.forEach(r => {
      previousCounts[r.emotion] = (previousCounts[r.emotion] || 0) + 1;
    });

    // Calcular porcentajes
    const recentTotal = recentRecords.length;
    const previousTotal = previousRecords.length;

    const emotionTrends = Object.keys(recentCounts)
      .map(emotion => {
        const currentPercentage = Math.round((recentCounts[emotion] / recentTotal) * 100);
        const previousPercentage = Math.round(
          ((previousCounts[emotion] || 0) / previousTotal) * 100
        );
        const percentageDiff = currentPercentage - previousPercentage;

        // Solo incluir emociones con cambios significativos
        if (Math.abs(percentageDiff) < 5) return null;

        return {
          emotion,
          label: emotionLabels[emotion] || emotion,
          currentPercentage,
          previousPercentage,
          percentageDiff,
          direction: percentageDiff > 0 ? 'up' : 'down',
          description:
            percentageDiff > 0
              ? `Esta emoción ha aumentado en los últimos días.`
              : `Esta emoción ha disminuido en los últimos días.`,
        };
      })
      .filter(Boolean);

    // Ordenar por magnitud del cambio
    return emotionTrends.sort((a, b) => Math.abs(b!.percentageDiff) - Math.abs(a!.percentageDiff));
  }, [records]);

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
      <Stack
        direction="column"
        spacing={2}
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 1, sm: 0 },
            width: '100%',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
              fontWeight: 600,
              mb: { xs: 1, sm: 0 },
            }}
          >
            Patrones Emocionales
          </Typography>
        </Box>
      </Stack>

      {records.length > 10 ? (
        <Grid container spacing={isMobile ? 1.5 : isTablet ? 2 : 3}>
          <Grid item xs={12} sm={12} md={6}>
            <DayOfWeekPatterns data={dayOfWeekData} isMobile={isMobile} isTablet={isTablet} />
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <HourlyPatterns data={hourlyData} isMobile={isMobile} isTablet={isTablet} />
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <CorrelationsTable data={correlationData} isMobile={isMobile} isTablet={isTablet} />
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <EmotionTrends data={trendData} isMobile={isMobile} isTablet={isTablet} />
          </Grid>
        </Grid>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2.5, md: 4 },
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}
        >
          <Box
            component="img"
            src="/images/pattern-analysis.svg"
            alt="Análisis de patrones"
            sx={{
              width: '100%',
              maxWidth: { xs: '200px', sm: '250px', md: '300px' },
              height: 'auto',
              mb: { xs: 2, md: 3 },
              opacity: 0.8,
            }}
          />

          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            Datos insuficientes para análisis de patrones
          </Typography>

          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            color="text.secondary"
            sx={{
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
            }}
          >
            Se necesitan más registros emocionales para identificar patrones significativos.
            Continúa utilizando el sistema para recopilar datos suficientes que permitan un análisis
            detallado de tus patrones emocionales.
          </Typography>

          <Typography
            variant={isMobile ? 'caption' : 'body2'}
            color="text.secondary"
            sx={{ mt: { xs: 2, md: 3 } }}
          >
            Recomendación: Se necesitan al menos 10-15 registros diarios durante varios días para
            obtener resultados de análisis confiables.
          </Typography>
        </Paper>
      )}
    </Layout>
  );
};

export default Patterns;
