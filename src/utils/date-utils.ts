import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha ISO en formato legible
 */
export const formatDate = (
  dateString: string | null | undefined,
  formatStr: string = 'dd/MM/yyyy HH:mm:ss'
): string => {
  if (!dateString) return 'Fecha desconocida';

  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Fecha inválida';
    return format(date, formatStr, { locale: es });
  } catch {
    console.error('Error al formatear fecha');
    return 'Error de formato';
  }
};

/**
 * Verifica si una fecha es válida
 */
export const isDateValid = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;

  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch {
    return false;
  }
};
