import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { EmotionRecord, EmotionStats, Emotion } from '../types/emotion-data';

const COLLECTION_NAME = 'emotions_data';

export const fetchEmotionRecords = async (): Promise<EmotionRecord[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convertir Timestamp de Firestore a string ISO si es necesario
      const date = data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date;

      return {
        id: doc.id,
        bpm: data.bpm,
        confidence: data.confidence,
        date: date,
        emotion: data.emotion,
        sweating: data.sweating,
      };
    });
  } catch (error) {
    console.error('Error fetching emotion records:', error);
    throw error;
  }
};

export const fetchRecentEmotionRecords = async (count: number = 10): Promise<EmotionRecord[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convertir Timestamp de Firestore a string ISO si es necesario
      const date = data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date;

      return {
        id: doc.id,
        bpm: data.bpm,
        confidence: data.confidence,
        date: date,
        emotion: data.emotion,
        sweating: data.sweating,
      };
    });
  } catch (error) {
    console.error('Error fetching recent emotion records:', error);
    throw error;
  }
};

export const calculateEmotionStats = (records: EmotionRecord[]): EmotionStats[] => {
  const emotionMap: Map<
    Emotion,
    { count: number; bpmSum: number; sweatingSum: number; confidenceSum: number }
  > = new Map();

  records.forEach(record => {
    const current = emotionMap.get(record.emotion) || {
      count: 0,
      bpmSum: 0,
      sweatingSum: 0,
      confidenceSum: 0,
    };
    emotionMap.set(record.emotion, {
      count: current.count + 1,
      bpmSum: current.bpmSum + record.bpm,
      sweatingSum: current.sweatingSum + record.sweating,
      confidenceSum: current.confidenceSum + record.confidence,
    });
  });

  return Array.from(emotionMap.entries()).map(([emotion, stats]) => ({
    emotion,
    count: stats.count,
    avgBpm: stats.bpmSum / stats.count,
    avgSweating: stats.sweatingSum / stats.count,
    avgConfidence: stats.confidenceSum / stats.count,
  }));
};
