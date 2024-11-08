// PagoExitoso.jsx
import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

function PagoExitoso() {
    return (
        <Container maxWidth="sm">
            <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    ¡Pago Exitoso!
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Tu matrícula ha sido registrada exitosamente y está pendiente de verificación.
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    El equipo de administración del colegio revisará tu certificado y aprobará la matrícula en las próximas 24-48 horas.
                </Typography>
                <Box mt={4}>
                    <Typography variant="body2" color="textSecondary">
                        Si tienes alguna pregunta, no dudes en ponerte en contacto con el colegio.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default PagoExitoso;
