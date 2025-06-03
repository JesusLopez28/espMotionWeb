import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Typography, Box, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { es } from 'date-fns/locale';
import { format, parseISO, isValid } from 'date-fns';
import type { EmotionRecord } from '../../types/emotion-data';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface MetricsLineChartProps {
  records: EmotionRecord[];
  metric: 'bpm' | 'sweating' | 'confidence';
  title: string;
  compactMode?: boolean;
}

const MetricsLineChart: React.FC<MetricsLineChartProps> = ({
  records,
  metric,
  title,
  compactMode = false,
}) => {
  const theme = useTheme();

  const getMetricColor = () => {
    switch (metric) {
      case 'bpm':
        return {
          line: theme.palette.secondary.main,
          background: `${theme.palette.secondary.main}20`,
        };
      case 'sweating':
        return {
          line: theme.palette.primary.main,
          background: `${theme.palette.primary.main}20`,
        };
      case 'confidence':
        return {
          line: theme.palette.success.main,
          background: `${theme.palette.success.main}20`,
        };
      default:
        return {
          line: theme.palette.primary.main,
          background: `${theme.palette.primary.main}20`,
        };
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'bpm':
        return 'Latidos por Minuto';
      case 'sweating':
        return 'Nivel de Sudoración';
      case 'confidence':
        return 'Nivel de Confianza (%)';
      default:
        return 'Valor';
    }
  };

  const getYAxisConfig = () => {
    switch (metric) {
      case 'bpm':
        return {
          min: Math.max(0, Math.floor(Math.min(...sortedRecords.map(r => r[metric])) * 0.9)),
          suggestedMax: Math.ceil(Math.max(...sortedRecords.map(r => r[metric])) * 1.1),
        };
      case 'sweating':
        return {
          min: 0,
          suggestedMax: Math.max(...sortedRecords.map(r => r[metric])) * 1.2,
        };
      case 'confidence':
        return {
          min: 0,
          max: 100,
        };
      default:
        return {
          beginAtZero: true,
        };
    }
  };

  // Procesamiento de datos
  const { chartData, sortedRecords } = useMemo(() => {
    // Validar y filtrar registros con fechas inválidas
    const validRecords = records.filter(record => {
      try {
        const date = parseISO(record.date);
        return isValid(date);
      } catch {
        console.warn('Registro con fecha inválida:', record);
        return false;
      }
    });

    // Ordenar por fecha
    const sorted = [...validRecords].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Preparar datos para el gráfico
    const labels = sorted.map(record => new Date(record.date));
    const data = sorted.map(record => record[metric]);
    const colors = getMetricColor();

    return {
      chartData: {
        labels,
        datasets: [
          {
            label: getMetricLabel(),
            data,
            fill: true,
            backgroundColor: colors.background,
            borderColor: colors.line,
            borderWidth: 2,
            tension: 0.4,
            pointRadius: compactMode ? 2 : 3,
            pointBackgroundColor: 'white',
            pointBorderColor: colors.line,
            pointBorderWidth: 1.5,
            pointHoverRadius: 5,
            cubicInterpolationMode: 'monotone' as const,
          },
        ],
      },
      sortedRecords: sorted,
    };
  }, [records, metric, compactMode]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !compactMode,
        position: 'top' as const,
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
          padding: 15,
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
          title: (tooltipItems: { label: string }[]) => {
            // Formatear fecha en español
            return format(new Date(tooltipItems[0].label), 'PPp', { locale: es });
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: compactMode ? ('day' as const) : ('hour' as const),
          tooltipFormat: 'PPp',
          displayFormats: {
            hour: 'HH:mm',
            day: 'dd/MM',
          },
        },
        title: {
          display: !compactMode,
          text: 'Fecha y hora',
          font: {
            weight: 'bold' as const,
          },
          color: theme.palette.text.secondary,
        },
        grid: {
          display: !compactMode,
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: compactMode ? 5 : 10,
          font: {
            size: compactMode ? 10 : 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        ...getYAxisConfig(),
        title: {
          display: !compactMode,
          text: getMetricLabel(),
          font: {
            weight: 'bold' as const,
          },
          color: theme.palette.text.secondary,
        },
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          precision: metric === 'sweating' ? 3 : 0,
          color: theme.palette.text.secondary,
          font: {
            size: compactMode ? 10 : 12,
          },
          maxTicksLimit: compactMode ? 5 : 8,
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: compactMode ? 1.5 : 2,
      },
      point: {
        radius: compactMode ? 1 : 3,
        hoverRadius: compactMode ? 3 : 5,
      },
    },
  };

  return (
    <Box sx={{ height: '100%', width: '100%', p: 1 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          fontSize: compactMode ? '1rem' : '1.25rem',
          textAlign: compactMode ? 'center' : 'left',
        }}
      >
        {title}
      </Typography>

      <Box sx={{ position: 'relative', height: compactMode ? '250px' : '350px' }}>
        {sortedRecords.length > 0 ? (
          <Line data={chartData} options={options} />
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
              No hay suficientes datos para mostrar la gráfica
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MetricsLineChart;
