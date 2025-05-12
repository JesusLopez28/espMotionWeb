import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Box, Alert, CircularProgress } from '@mui/material';
import { checkFirestoreConnection, checkDocumentStructure } from '../../utils/firebase-debug';

const FirebaseDebug: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [structureResult, setStructureResult] = useState<any>(null);
  const [collectionName, setCollectionName] = useState('emotion_data');

  const handleCheck = async () => {
    setIsChecking(true);
    setResult(null);
    
    try {
      const connectionResult = await checkFirestoreConnection(collectionName);
      setResult(connectionResult);
      
      if (connectionResult.success && connectionResult.hasDocuments) {
        const structureCheck = await checkDocumentStructure(collectionName);
        setStructureResult(structureCheck);
      }
    } catch (error) {
      console.error('Error en diagnóstico:', error);
      setResult({ success: false, error });
    } finally {
      setIsChecking(false);
    }
  };

  // Ejecutar automáticamente al cargar
  useEffect(() => {
    handleCheck();
  }, []);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Diagnóstico de Conexión a Firebase
      </Typography>
      
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCheck}
          disabled={isChecking}
        >
          {isChecking ? <CircularProgress size={24} color="inherit" /> : 'Verificar Conexión'}
        </Button>
        <Typography variant="body2" color="text.secondary">
          Colección: {collectionName}
        </Typography>
      </Box>

      {isChecking && (
        <Alert severity="info">Verificando conexión con Firebase...</Alert>
      )}

      {result && (
        <Box sx={{ mt: 2 }}>
          <Alert 
            severity={result.success ? (result.hasDocuments ? "success" : "warning") : "error"}
            sx={{ mb: 2 }}
          >
            {result.success 
              ? (result.hasDocuments 
                  ? `Conexión exitosa. Se encontraron ${result.documentCount} documentos.`
                  : "Conexión exitosa pero no se encontraron documentos.")
              : `Error de conexión: ${result.message}`
            }
          </Alert>
          
          {result.documentIds && result.documentIds.length > 0 && (
            <Typography variant="body2">
              IDs de muestra: {result.documentIds.slice(0, 3).join(', ')}
              {result.documentIds.length > 3 ? ' ...' : ''}
            </Typography>
          )}
        </Box>
      )}

      {structureResult && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Validación de estructura
          </Typography>
          
          <Alert 
            severity={structureResult.valid ? "success" : "warning"}
            sx={{ mb: 2 }}
          >
            {structureResult.valid 
              ? "Todos los documentos tienen la estructura correcta" 
              : "Algunos documentos tienen problemas de estructura"}
          </Alert>

          {structureResult.documentChecks && 
            structureResult.documentChecks
              .filter((check: any) => !check.valid)
              .slice(0, 3)
              .map((check: any, index: number) => (
                <Alert severity="warning" key={index} sx={{ mb: 1 }}>
                  Documento {check.id}: {check.issues.join(', ')}
                </Alert>
              ))}
        </Box>
      )}
    </Paper>
  );
};

export default FirebaseDebug;
