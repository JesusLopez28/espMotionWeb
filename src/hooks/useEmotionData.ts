import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  Timestamp,
  getDocs,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { EmotionRecord, EmotionStats } from '../types/emotion-data';
import { calculateEmotionStats } from '../services/emotion-service';
import { useOnlineStatus } from './useOnlineStatus';

// Habilitar la persistencia para funcionamiento offline
// Esta función debe llamarse solo una vez al inicio de la aplicación
try {
  enableIndexedDbPersistence(db)
    .then(() => console.log('Persistencia de Firestore habilitada'))
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('La persistencia falló: múltiples pestañas abiertas');
      } else if (err.code === 'unimplemented') {
        console.warn('El navegador actual no soporta persistencia');
      }
    });
} catch (error) {
  console.error('Error al configurar persistencia:', error);
}

interface UseEmotionDataProps {
  realtimeUpdates?: boolean;
  limitCount?: number;
  daysBack?: number;
  collectionName?: string;
}

// Estos son nombres alternativos a probar si el nombre principal no funciona
const COLLECTION_ALTERNATIVES = [
  'emotion_data', // Nombre original
  'emotion', // Nombre alternativo
];

export const useEmotionData = ({
  realtimeUpdates = true,
  limitCount,
  daysBack,
  collectionName = 'emotion_data',
}: UseEmotionDataProps = {}) => {
  const [records, setRecords] = useState<EmotionRecord[]>([]);
  const [stats, setStats] = useState<EmotionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [testedCollections, setTestedCollections] = useState<string[]>([]);
  const { isOnline } = useOnlineStatus();
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    setLoading(true);
    console.log(`Iniciando carga de datos de emociones desde '${collectionName}'...`);
    console.log(`Estado de conexión: ${isOnline ? 'En línea' : 'Sin conexión'}`);

    if (!isOnline) {
      setOfflineMode(true);
    }

    const fetchData = async () => {
      // Si ya probamos todas las alternativas y no hay datos, mostrar error
      if (testedCollections.length >= COLLECTION_ALTERNATIVES.length) {
        setError(
          new Error(
            `No se encontraron datos en ninguna de las colecciones probadas: ${testedCollections.join(', ')}`
          )
        );
        setLoading(false);
        return;
      }

      // Seleccionar la colección a probar
      const currentCollection =
        testedCollections.length === 0
          ? collectionName
          : COLLECTION_ALTERNATIVES[testedCollections.length];

      console.log(`Probando colección: '${currentCollection}'`);

      try {
        const collectionRef = collection(db, currentCollection);
        let q = query(collectionRef, orderBy('date', 'desc'));

        // Aplicar filtro por fecha si es necesario
        if (daysBack) {
          // Para datos del futuro (2025), omitimos el filtro de fecha
          console.log('Filtro de días desactivado para permitir datos futuros');
        }

        // Aplicar límite si es necesario
        if (limitCount) {
          q = query(q, limit(limitCount));
          console.log(`Limitando resultados a ${limitCount}`);
        }

        // Realizar una consulta de prueba
        const testSnapshot = await getDocs(q);
        console.log(
          `Prueba en '${currentCollection}': ${testSnapshot.size} documentos encontrados`
        );

        // Si no hay resultados y hay más colecciones para probar, probar la siguiente
        if (testSnapshot.empty && testedCollections.length < COLLECTION_ALTERNATIVES.length - 1) {
          setTestedCollections([...testedCollections, currentCollection]);
          return; // Salir para que el efecto se vuelva a ejecutar con la siguiente colección
        }

        // Si hay resultados o es la última colección, proceder con la consulta normal
        if (realtimeUpdates) {
          console.log(`Configurando listener en tiempo real para '${currentCollection}'...`);
          const unsubscribe = onSnapshot(
            q,
            snapshot => {
              console.log(`Documentos recibidos: ${snapshot.docs.length}`);
              setOfflineMode(snapshot.metadata.fromCache);
              
              if (snapshot.metadata.fromCache) {
                console.log('Datos obtenidos desde la caché local (modo offline)');
              }

              const newRecords: EmotionRecord[] = snapshot.docs.map(doc => {
                const data = doc.data();

                // Manejar diferentes formatos de fecha
                let dateStr: string;
                if (data.date instanceof Timestamp) {
                  dateStr = data.date.toDate().toISOString();
                } else if (typeof data.date === 'string') {
                  dateStr = data.date; // Usar el string directamente
                } else {
                  console.warn(`Formato de fecha desconocido para ${doc.id}:`, data.date);
                  dateStr = new Date().toISOString(); // Fallback
                }

                return {
                  id: doc.id,
                  bpm: Number(data.bpm),
                  confidence: Number(data.confidence),
                  date: dateStr,
                  emotion: data.emotion,
                  sweating: Number(data.sweating),
                };
              });

              console.log('Registros procesados:', newRecords.length);
              setRecords(newRecords);

              const calculatedStats = calculateEmotionStats(newRecords);
              console.log('Estadísticas calculadas:', calculatedStats);
              setStats(calculatedStats);

              setLoading(false);
            },
            err => {
              console.error(`Error en listener de Firestore para '${currentCollection}':`, err);

              // Si el error es por falta de conexión, mostrar mensaje específico
              if (!isOnline || err.code === 'failed-precondition' || err.code === 'unavailable') {
                setError(new Error('No hay conexión a Internet. Usando datos en caché si están disponibles.'));
                setOfflineMode(true);
              } else if (testedCollections.length < COLLECTION_ALTERNATIVES.length - 1) {
                setTestedCollections([...testedCollections, currentCollection]);
              } else {
                setError(err as Error);
              }
              
              setLoading(false);
            }
          );

          return () => {
            console.log(`Cancelando suscripción a Firestore para '${currentCollection}'`);
            unsubscribe();
          };
        } else {
          // One time fetch
          const newRecords: EmotionRecord[] = testSnapshot.docs.map(doc => {
            const data = doc.data();

            // Manejar diferentes formatos de fecha
            let dateStr: string;
            if (data.date instanceof Timestamp) {
              dateStr = data.date.toDate().toISOString();
            } else if (typeof data.date === 'string') {
              dateStr = data.date; // Usar el string directamente
            } else {
              console.warn(`Formato de fecha desconocido para ${doc.id}:`, data.date);
              dateStr = new Date().toISOString(); // Fallback
            }

            return {
              id: doc.id,
              bpm: Number(data.bpm),
              confidence: Number(data.confidence),
              date: dateStr,
              emotion: data.emotion,
              sweating: Number(data.sweating),
            };
          });

          console.log('Registros procesados:', newRecords.length);
          setRecords(newRecords);

          const calculatedStats = calculateEmotionStats(newRecords);
          console.log('Estadísticas calculadas:', calculatedStats);
          setStats(calculatedStats);

          setLoading(false);
        }
      } catch (err) {
        console.error(`Error al consultar '${currentCollection}':`, err);

        // Si el error es por falta de conexión, mostrar mensaje específico
        if (!isOnline) {
          setError(new Error('No hay conexión a Internet. Usando datos en caché si están disponibles.'));
          setOfflineMode(true);
        } else if (testedCollections.length < COLLECTION_ALTERNATIVES.length - 1) {
          setTestedCollections([...testedCollections, currentCollection]);
        } else {
          setError(err as Error);
        }
        
        setLoading(false);
      }
    };

    fetchData();
  }, [realtimeUpdates, limitCount, daysBack, collectionName, testedCollections, isOnline]);

  return { records, stats, loading, error, offlineMode };
};
