import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar el estado de conexión del usuario
 * @returns Un objeto con el estado de conexión actual y un indicador de si cambió recientemente
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [recentlyChanged, setRecentlyChanged] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setRecentlyChanged(true);
      // Resetear el indicador después de mostrar la notificación
      setTimeout(() => setRecentlyChanged(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setRecentlyChanged(true);
      // Resetear el indicador después de mostrar la notificación
      setTimeout(() => setRecentlyChanged(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, recentlyChanged };
};
