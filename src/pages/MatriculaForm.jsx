import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Input, Stepper, Step, StepLabel, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import Navbar from '../components/Navbar';
import StripePayment from '../components/StripePayment';

const steps = ['Registro de Datos', 'Confirmación', 'Pago'];

function MatriculaForm() {
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [grado, setGrado] = useState('');
    const [direccion, setDireccion] = useState('');
    const [certificado, setCertificado] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const username = localStorage.getItem('username') || 'Usuario';
    const navigate = useNavigate();

    useEffect(() => {
        const checkStudent = async () => {
            try {
                const response = await axios.get('/matriculas/check-student/');
                if (response.data.has_student) {
                    navigate('/pago');
                }
            } catch (error) {
                console.error("Error checking student:", error);
            }
        };
        checkStudent();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('dni', dni);
        formData.append('fecha_nacimiento', fechaNacimiento);
        formData.append('grado', grado);
        formData.append('direccion', direccion);
        formData.append('certificado_estudios', certificado);

        try {
            const response = await axios.post('/matriculas/estudiante/crear/', formData);
            setClientSecret(response.data.client_secret);
            setStep(2); // Mover a la etapa de pago
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error en matrícula:', error);
        }
        setLoading(false);
    };

    return (
        <>
            <Container maxWidth="sm">
                <Stepper activeStep={step} alternativeLabel sx={{ mt: 4, mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {step === 0 && (
                    <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h4" component="h1" align="center" gutterBottom>
                            Formulario de Matrícula
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField label="Nombre Completo" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth margin="normal" required />
                            <TextField label="DNI" value={dni} onChange={(e) => setDni(e.target.value)} fullWidth margin="normal" required error={!/^\d{8}$/.test(dni)} helperText={!/^\d{8}$/.test(dni) ? "Ingrese un DNI válido de 8 dígitos" : ""} />
                            <TextField label="Fecha de Nacimiento" type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} fullWidth margin="normal" required InputLabelProps={{ shrink: true }} />
                            <TextField label="Grado" value={grado} onChange={(e) => setGrado(e.target.value)} fullWidth margin="normal" required />
                            <TextField label="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} fullWidth margin="normal" required />
                            <Input type="file" onChange={(e) => setCertificado(e.target.files[0])} fullWidth margin="normal" sx={{ mt: 2 }} />
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Registrar Estudiante'}
                            </Button>
                        </form>
                    </Paper>
                )}
                {step === 1 && (
                    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                        <Typography variant="h6">Resumen de Matrícula</Typography>
                        <Typography>Nombre: {nombre}</Typography>
                        <Typography>DNI: {dni}</Typography>
                        <Typography>Fecha de Nacimiento: {fechaNacimiento}</Typography>
                        <Typography>Grado: {grado}</Typography>
                        <Typography>Dirección: {direccion}</Typography>
                        <Button variant="contained" color="primary" onClick={() => setStep(2)}>
                            Confirmar y Proceder al Pago
                        </Button>
                    </Paper>
                )}
                {step === 2 && clientSecret && (
                    <Box mt={3}>
                        <Typography variant="h6" align="center" gutterBottom>
                            ¡Estudiante registrado! Procede al pago.
                        </Typography>
                        <StripePayment clientSecret={clientSecret} onSuccess={() => navigate('/')} />
                    </Box>
                )}
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                    <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                        Estudiante registrado con éxito.
                    </Alert>
                </Snackbar>
            </Container>
        </>
    );
}

export default MatriculaForm;
