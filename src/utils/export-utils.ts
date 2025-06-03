import type { EmotionRecord } from '../types/emotion-data';

/**
 * Exporta registros emocionales a CSV
 */
export const exportToCSV = (records: EmotionRecord[]): void => {
  // Encabezados
  const headers = ['ID', 'Fecha', 'Emoción', 'BPM', 'Sudoración', 'Confianza'];

  // Mapear datos
  const data = records.map(record => [
    record.id,
    record.date,
    record.emotion,
    record.bpm.toString(),
    record.sweating.toString(),
    record.confidence.toString() + '%',
  ]);

  // Combinar encabezados y datos
  const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n');

  // Crear y descargar el archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', `emociones_${new Date().toISOString()}.csv`);
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
