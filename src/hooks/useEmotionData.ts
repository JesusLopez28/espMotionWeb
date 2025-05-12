import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  limit,
  Timestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { EmotionRecord, EmotionStats } from '../types/emotion-data';
import { calculateEmotionStats } from '../services/emotion-service';
import { subDays } from 'date-fns';

interface UseEmotionDataProps {
  realtimeUpdates?: boolean;
  limitCount?: number;
  daysBack?: number;
}

export const useEmotionData = ({
  realtimeUpdates = true,
  limitCount,
  daysBack,
}: UseEmotionDataProps = {}) => {
  const [records, setRecords] = useState<EmotionRecord[]>([]);
  const [stats, setStats] = useState<EmotionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    try {
      const collectionRef = collection(db, 'emotions_data');
      let q = query(collectionRef, orderBy('date', 'desc'));

      // Aplicar filtro por fecha si es necesario
      if (daysBack) {
        const cutoffDate = subDays(new Date(), daysBack);
        // Convertir a timestamp para la consulta de Firestore
        const cutoffTimestamp = Timestamp.fromDate(cutoffDate);
        q = query(q, where('date', '>=', cutoffTimestamp));
      }

      // Aplicar límite si es necesario
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      let unsubscribe: () => void;

      if (realtimeUpdates) {
        unsubscribe = onSnapshot(
          q,
          snapshot => {
            const newRecords: EmotionRecord[] = snapshot.docs.map(doc => {
              const data = doc.data();
              // Convertir Timestamp de Firestore a string ISO
              const date =
                data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date;

              return {
                id: doc.id,
                bpm: data.bpm,
                confidence: data.confidence,
                date: date,
                emotion: data.emotion,
                sweating: data.sweating,
              };
            });

            setRecords(newRecords);
            setStats(calculateEmotionStats(newRecords));
            setLoading(false);
          },
          err => {
            console.error('Error in snapshot listener:', err);
            setError(err as Error);
            setLoading(false);
          }
        );
      } else {
        // One time fetch
        const fetchData = async () => {
          try {
            const querySnapshot = await getDocs(q);
            const newRecords: EmotionRecord[] = querySnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                bpm: data.bpm,
                confidence: data.confidence,
                date: data.date,
                emotion: data.emotion,
                sweating: data.sweating,
              };
            });

            setRecords(newRecords);
            setStats(calculateEmotionStats(newRecords));
          } catch (err) {
            console.error('Error fetching emotion data:', err);
            setError(err as Error);
          } finally {
            setLoading(false);
          }
        };

        fetchData();
        return undefined;
      }

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } catch (err) {
      console.error('Error setting up query:', err);
      setError(err as Error);
      setLoading(false);
      return undefined;
    }
  }, [realtimeUpdates, limitCount, daysBack]);

  return { records, stats, loading, error };
};
