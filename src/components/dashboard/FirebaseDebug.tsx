import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Box, Alert, CircularProgress, useTheme, Chip, Divider } from '@mui/material';
import { checkFirestoreConnection, checkDocumentStructure } from '../../utils/firebase-debug';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const FirebaseDebug: React.FC = () => {
  const theme = useTheme();
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [structureResult, setStructureResult] = useState<any>(null);
  const [collectionName] = useState('emotion_data');

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
    <Paper 
      sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: result?.success ? 
          `1px solid ${theme.palette.success.light}` : 
          result?.success === false ? 
          `1px solid ${theme.palette.error.light}` : 
          'none'
      }} 
      elevation={0}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Diagnóstico de Conexión
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Verificando la conexión con Firebase y la estructura de datos
          </Typography>
        </Box>
        
        <Chip 
          icon={<CloudDoneIcon />} 
          label={collectionName}
          color="primary"
          variant="outlined"
          size="small"
        />
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCheck}
          disabled={isChecking}
          startIcon={isChecking ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
          sx={{ borderRadius: 2 }}
        >
          {isChecking ? 'Verificando...' : 'Verificar Conexión'}
        </Button>
      </Box>

      {isChecking && (
        <Alert 
          severity="info" 
          icon={<CircularProgress size={20} />}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          Verificando conexión con Firebase...
        </Alert>
      )}

      {result && (
        <Box sx={{ mt: 2 }}>
          <Alert 
            severity={result.success ? (result.hasDocuments ? "success" : "warning") : "error"}
            sx={{ mb: 2, borderRadius: 2 }}
            icon={result.success ? 
              (result.hasDocuments ? <CloudDoneIcon /> : <ErrorOutlineIcon />) : 
              <CloudOffIcon />
            }
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {result.success 
                ? (result.hasDocuments 
                    ? `Conexión exitosa` 
                    : "Conexión establecida pero sin documentos")
                : `Error de conexión: ${result.message}`
              }
            </Typography>
            
            {result.success && result.hasDocuments && (
              <Typography variant="body2">
                Se encontraron {result.documentCount} documentos en la colección.
              </Typography>
            )}
          </Alert>
          
          {result.documentIds && result.documentIds.length > 0 && (
            <Box sx={{ mb: 2, p: 2, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.02)' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Documentos de muestra:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {result.documentIds.slice(0, 5).map((id: string, index: number) => (
                  <Chip 
                    key={index} 
                    label={id.length > 15 ? `${id.substring(0, 15)}...` : id} 
                    size="small"
                    variant="outlined"
                    sx={{ fontFamily: 'monospace' }}
                  />
                ))}
                {result.documentIds.length > 5 && (
                  <Chip 
                    label={`+${result.documentIds.length - 5} más`} 
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {structureResult && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <VerifiedUserIcon sx={{ mr: 1, color: structureResult.valid ? theme.palette.success.main : theme.palette.warning.main }} />
            <Typography variant="subtitle1" fontWeight={600}>
              Validación de estructura
            </Typography>
          </Box>
          
          <Alert 
            severity={structureResult.valid ? "success" : "warning"}
            sx={{ mb: 2, borderRadius: 2 }}
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
                <Alert severity="warning" key={index} sx={{ mb: 1, borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight={500}>
                    Documento {check.id}:
                  </Typography>
                  <Typography variant="body2">
                    {check.issues.join(', ')}
                  </Typography>
                </Alert>
              ))}
        </Box>
      )}
    </Paper>
  );
};

export default FirebaseDebug;
