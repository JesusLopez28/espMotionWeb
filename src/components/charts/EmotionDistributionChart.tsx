import React, { useMemo } from 'react';
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
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import type { EmotionRecord, Emotion } from '../../types/emotion-data';
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Box, Typography, useTheme } from '@mui/material';

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

interface EmotionDistributionChartProps {
  records: EmotionRecord[];
}

const EmotionDistributionChart: React.FC<EmotionDistributionChartProps> = ({ records }) => {
  const theme = useTheme();
  
  // Procesar los datos para agruparlos por día y contar las emociones
  const { processedData, dateRange } = useMemo(() => {
    // Definir los colores dentro del useMemo para evitar recreaciones innecesarias
    const emotionColors: Record<string, { line: string, background: string }> = {
      happy: { line: 'rgba(255, 215, 0, 1)', background: 'rgba(255, 215, 0, 0.2)' },
      sad: { line: 'rgba(65, 105, 225, 1)', background: 'rgba(65, 105, 225, 0.2)' },
      fear: { line: 'rgba(153, 102, 255, 1)', background: 'rgba(153, 102, 255, 0.2)' },
      neutral: { line: 'rgba(169, 169, 169, 1)', background: 'rgba(169, 169, 169, 0.2)' },
      angry: { line: 'rgba(255, 99, 132, 1)', background: 'rgba(255, 99, 132, 0.2)' },
      disgust: { line: 'rgba(75, 192, 192, 1)', background: 'rgba(75, 192, 192, 0.2)' },
      surprise: { line: 'rgba(255, 159, 64, 1)', background: 'rgba(255, 159, 64, 0.2)' },
    };

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

    // Ordenar los registros por fecha
    const sortedRecords = [...validRecords].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Establecer rango de fechas para el gráfico
    let startDate = new Date();
    let endDate = new Date();
    
    if (sortedRecords.length > 0) {
      startDate = new Date(sortedRecords[0].date);
      endDate = new Date(sortedRecords[sortedRecords.length - 1].date);
    }

    // Agrupar por día
    const groupedByDay: Record<string, Record<Emotion, number>> = {};
    const emotions = new Set<Emotion>();

    sortedRecords.forEach(record => {
      const date = parseISO(record.date);
      const dayKey = format(date, 'yyyy-MM-dd');

      if (!groupedByDay[dayKey]) {
        groupedByDay[dayKey] = {} as Record<Emotion, number>;
      }

      emotions.add(record.emotion);

      if (!groupedByDay[dayKey][record.emotion]) {
        groupedByDay[dayKey][record.emotion] = 1;
      } else {
        groupedByDay[dayKey][record.emotion] += 1;
      }
    });

    // Obtener etiquetas de emoción en español
    const emotionLabels: Record<Emotion, string> = {
      happy: 'Feliz',
      sad: 'Triste',
      fear: 'Miedo',
      neutral: 'Neutral',
      angry: 'Enojo',
      disgust: 'Disgusto',
      surprise: 'Sorpresa'
    };

    // Convertir a arrays para Chart.js
    const labels = Object.keys(groupedByDay).sort();
    const datasets = Array.from(emotions).map(emotion => ({
      label: emotionLabels[emotion],
      data: labels.map(day => groupedByDay[day][emotion] || 0),
      backgroundColor: emotionColors[emotion].background,
      borderColor: emotionColors[emotion].line,
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: 'white',
      pointBorderColor: emotionColors[emotion].line,
      pointBorderWidth: 1.5,
      pointHoverRadius: 5,
      fill: true,
      // Hacer curvas más suaves
      cubicInterpolationMode: 'monotone' as const,
    }));

    return { 
      processedData: { labels, datasets },
      dateRange: { startDate, endDate }
    };
  }, [records]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
          padding: 20,
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
            const date = tooltipItems[0].label;
            return format(new Date(date), 'PPP', { locale: es });
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          tooltipFormat: 'PP',
          displayFormats: {
            day: 'dd/MM'
          }
        },
        title: {
          display: true,
          text: 'Fecha',
          font: {
            weight: 'bold' as const,
          },
          color: theme.palette.text.secondary,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de detecciones',
          font: {
            weight: 'bold' as const,
          },
          color: theme.palette.text.secondary,
        },
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          precision: 0, // Solo enteros
          color: theme.palette.text.secondary,
        },
        border: {
          display: false,
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 5
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Evolución de Emociones
      </Typography>
      
      {records.length > 1 ? (
        <>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Mostrando datos desde {format(dateRange.startDate, 'PPP', { locale: es })} 
            {' '}hasta{' '}
            {format(dateRange.endDate, 'PPP', { locale: es })}
          </Typography>
          
          <Box sx={{ flex: 1, position: 'relative', height: '350px' }}>
            <Line 
              options={options} 
              data={{
                labels: processedData.labels,
                datasets: processedData.datasets,
              }} 
            />
          </Box>
        </>
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flex: 1,
            borderRadius: 2,
            border: `1px dashed ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Se necesitan más registros para mostrar la evolución de emociones
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EmotionDistributionChart;
