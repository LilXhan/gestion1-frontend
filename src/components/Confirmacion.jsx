import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Confirmacion() {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                <Typography variant="h4" gutterBottom>
                    Pago Completado
                </Typography>
                <Typography variant="body1" gutterBottom>
                    ¡Gracias por completar el pago! Tu matrícula ha sido registrada exitosamente.
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/')} sx={{ mt: 3 }}>
                    Volver al inicio
                </Button>
            </Box>
        </Container>
    );
}

export default Confirmacion;
