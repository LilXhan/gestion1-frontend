import { Container, Typography, Paper, Box } from '@mui/material';

function MatriculaAprobada() {
    return (
        <Container maxWidth="sm">
            <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Matrícula Aprobada
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Tu matrícula ha sido aprobada exitosamente. Acércate al colegio para completar el proceso administrativo.
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Para más información, contacta con la administración del colegio.
                </Typography>
                <Box mt={4}>
                    <Typography variant="body2" color="textSecondary">
                        ¡Gracias por confiar en nuestro servicio educativo!
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default MatriculaAprobada;
