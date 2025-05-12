import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Utilidad para verificar la conexión a Firestore y la existencia de documentos
 * @returns Promise que se resuelve con información de diagnóstico
 */
export const checkFirestoreConnection = async (collectionName = 'emotion_data') => {
  console.log(`🔍 Verificando conexión a colección '${collectionName}'...`);
  
  try {
    // Lista todas las colecciones (esto requiere permisos especiales)
    const collectionsRef = collection(db, collectionName);
    const q = query(collectionsRef, limit(5));
    const querySnapshot = await getDocs(q);
    
    console.log(`✅ Conexión exitosa. Documentos encontrados: ${querySnapshot.size}`);
    
    if (querySnapshot.empty) {
      console.warn(`⚠️ No se encontraron documentos en la colección '${collectionName}'`);
      return { success: true, hasDocuments: false, message: 'Sin documentos' };
    }
    
    // Mostrar el primer documento como ejemplo
    const firstDoc = querySnapshot.docs[0];
    console.log('Ejemplo de documento:', firstDoc.id, firstDoc.data());
    
    // Mostrar todos los IDs de documentos encontrados
    const docIds = querySnapshot.docs.map(doc => doc.id);
    console.log('IDs de documentos:', docIds);
    
    return { 
      success: true, 
      hasDocuments: true, 
      documentCount: querySnapshot.size,
      documentIds: docIds
    };
  } catch (error) {
    console.error('❌ Error al verificar Firestore:', error);
    return { 
      success: false, 
      error,
      message: (error as Error).message
    };
  }
};

/**
 * Utilidad para verificar si hay problemas de formato en los datos
 */
export const checkDocumentStructure = async (collectionName = 'emotion_data') => {
  try {
    const collectionsRef = collection(db, collectionName);
    const q = query(collectionsRef, limit(10));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { valid: false, message: 'No hay documentos para verificar' };
    }
    
    const validations = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const id = doc.id;
      const issues = [];
      
      // Validar presencia de campos requeridos
      if (!data.hasOwnProperty('bpm')) issues.push('Falta el campo bpm');
      if (!data.hasOwnProperty('confidence')) issues.push('Falta el campo confidence');
      if (!data.hasOwnProperty('date')) issues.push('Falta el campo date');
      if (!data.hasOwnProperty('emotion')) issues.push('Falta el campo emotion');
      if (!data.hasOwnProperty('sweating')) issues.push('Falta el campo sweating');
      
      return { id, valid: issues.length === 0, issues, data };
    });
    
    const allValid = validations.every(v => v.valid);
    
    return {
      valid: allValid,
      documentChecks: validations
    };
  } catch (error) {
    console.error('Error validando documentos:', error);
    return { valid: false, error, message: (error as Error).message };
  }
};
