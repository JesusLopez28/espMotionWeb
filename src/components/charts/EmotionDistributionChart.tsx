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
  // Procesar los datos para agruparlos por día y contar las emociones
  const processedData = useMemo(() => {
    // Definir los colores dentro del useMemo para evitar recreaciones innecesarias
    const emotionColors: Record<string, string> = {
      happy: 'rgba(255, 206, 86, 0.7)',
      sad: 'rgba(54, 162, 235, 0.7)',
      fear: 'rgba(153, 102, 255, 0.7)',
      neutral: 'rgba(201, 203, 207, 0.7)',
      angry: 'rgba(255, 99, 132, 0.7)',
      disgust: 'rgba(75, 192, 192, 0.7)',
      surprise: 'rgba(255, 159, 64, 0.7)',
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

    // Convertir a arrays para Chart.js
    const labels = Object.keys(groupedByDay).sort();
    const datasets = Array.from(emotions).map(emotion => ({
      label: emotion,
      data: labels.map(day => groupedByDay[day][emotion] || 0),
      backgroundColor: emotionColors[emotion],
      borderColor: emotionColors[emotion].replace('0.7', '1'),
      borderWidth: 1,
      tension: 0.4,
    }));

    return { labels, datasets };
  }, [records]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
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
        },
        title: {
          display: true,
          text: 'Fecha',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de detecciones',
        },
      },
    },
  };

  return (
    <Line
      options={options}
      data={{
        labels: processedData.labels,
        datasets: processedData.datasets,
      }}
    />
  );
};

export default EmotionDistributionChart;
