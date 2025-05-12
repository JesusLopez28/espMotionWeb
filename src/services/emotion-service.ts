import { collection, getDocs, query, orderBy, limit, Timestamp, getFirestore, getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { EmotionRecord, EmotionStats, Emotion } from '../types/emotion-data';

// IMPORTANTE: Asegúrate de que este nombre coincide exactamente con tu colección en Firebase
// Hay casos donde por error tipográfico no se accede a la colección correcta
const COLLECTION_NAME = 'emotion_data';

export const fetchEmotionRecords = async (): Promise<EmotionRecord[]> => {
  try {
    console.log(`Intentando acceder a la colección: '${COLLECTION_NAME}'`);
    
    // Intentar primero con un método alternativo para verificar si hay datos
    const firstQuery = query(collection(db, COLLECTION_NAME), limit(1));
    const testSnapshot = await getDocs(firstQuery);
    console.log(`Prueba inicial: ${testSnapshot.size} documentos encontrados`);
    
    if (testSnapshot.empty) {
      console.warn(`⚠️ La colección '${COLLECTION_NAME}' parece estar vacía o no existe`);
      
      // Verificar si los IDs que mencionaste existen directamente
      const testIds = ['/0iF9jK1f8CqsJVArm844', '/5oNSUsOwiuqeWdkJcG6L'];
      for (const testId of testIds) {
        try {
          // Quitar la barra inicial si está presente
          const cleanId = testId.startsWith('/') ? testId.substring(1) : testId;
          const docRef = doc(db, COLLECTION_NAME, cleanId);
          const docSnap = await getDoc(docRef);
          console.log(`Buscando documento con ID '${cleanId}': ${docSnap.exists() ? 'Encontrado' : 'No existe'}`);
          if (docSnap.exists()) {
            console.log('Datos del documento:', docSnap.data());
          }
        } catch (e) {
          console.error(`Error al buscar documento ${testId}:`, e);
        }
      }
    }
    
    // Continuar con la consulta original
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    console.log('Registros recuperados:', querySnapshot.docs.length);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Documento recuperado:', doc.id, data);
      
      // Manejar diferentes formatos de fecha (Timestamp o string)
      let dateStr: string;
      if (data.date instanceof Timestamp) {
        dateStr = data.date.toDate().toISOString();
      } else if (typeof data.date === 'string') {
        // Si ya es string, usarlo directamente
        dateStr = data.date;
      } else {
        // Fallback si no es ninguno de los anteriores
        console.warn(`Formato de fecha desconocido para el documento ${doc.id}:`, data.date);
        dateStr = new Date().toISOString(); // Fecha actual como fallback
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
  } catch (error) {
    console.error('Error fetching emotion records:', error);
    throw error;
  }
};

export const fetchRecentEmotionRecords = async (count: number = 10): Promise<EmotionRecord[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    
    console.log('Registros recientes recuperados:', querySnapshot.docs.length);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Manejar diferentes formatos de fecha (Timestamp o string)
      let dateStr: string;
      if (data.date instanceof Timestamp) {
        dateStr = data.date.toDate().toISOString();
      } else if (typeof data.date === 'string') {
        // Si ya es string, usarlo directamente
        dateStr = data.date;
      } else {
        // Fallback si no es ninguno de los anteriores
        console.warn(`Formato de fecha desconocido para el documento ${doc.id}:`, data.date);
        dateStr = new Date().toISOString(); // Fecha actual como fallback
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
