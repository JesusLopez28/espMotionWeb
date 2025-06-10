import React from 'react';
import Layout from '../components/layout/Layout';
import {
    Box,
    Typography,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Layout>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', mb: 2 }}>
                    404
                </Typography>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Página no encontrada
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    La página que buscas no existe o ha sido movida.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleGoHome}
                >
                    Volver al inicio
                </Button>
            </Box>
        </Layout>
    );
};

export default NotFound;
