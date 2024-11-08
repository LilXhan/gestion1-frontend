// MatriculaForm.jsx
import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Stepper, Step, StepLabel, CircularProgress, Input } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import axios from '../utils/axiosConfig';
import StripePayment from '../components/StripePayment';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const steps = ['Registro de Datos', 'Confirmación', 'Pago'];

// Estilos para centrar el spinner en el medio de la pantalla
const LoadingContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    flexDirection: 'column',
}));

function MatriculaForm() {
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [grado, setGrado] = useState('');
    const [direccion, setDireccion] = useState('');
    const [certificado, setCertificado] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(null); // Inicialmente nulo para que no renderice el primer paso si ya se completó
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const initializeForm = async () => {
            try {
                const response = await axios.get('/api/matriculas/check-student/');
                if (response.data.payment_completed) {
                    navigate('/pago-exitoso'); // Redirige directamente si ya completó el pago
                } else if (response.data.has_student) {
                    setClientSecret(response.data.client_secret);
                    setStep(2); // Ir directamente al paso de pago si ya existe el estudiante
                } else {
                    setStep(0); // Mostrar el paso de registro si no hay estudiante registrado
                }
            } catch (error) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'Error al verificar el estado del estudiante.',
                    showConfirmButton: false,
                    timer: 3000
                });
                setStep(0); // En caso de error, aseguramos que pueda intentar registrarse
            }
        };
        initializeForm();
    }, [navigate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('formData') || '{}');
        if (storedData.nombre) setNombre(storedData.nombre);
        if (storedData.dni) setDni(storedData.dni);
        if (storedData.fechaNacimiento) setFechaNacimiento(storedData.fechaNacimiento);
        if (storedData.grado) setGrado(storedData.grado);
        if (storedData.direccion) setDireccion(storedData.direccion);
    }, []);

    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify({ nombre, dni, fechaNacimiento, grado, direccion }));
    }, [nombre, dni, fechaNacimiento, grado, direccion]);

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
            const response = await axios.post('/api/matriculas/estudiante/crear/', formData);
            setClientSecret(response.data.client_secret);
            setStep(2);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Estudiante registrado. Procede al pago.',
                showConfirmButton: false,
                timer: 3000
            });
            localStorage.removeItem('formData');
        } catch (error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'No se pudo completar el registro.',
                showConfirmButton: false,
                timer: 3000
            });
        }
        setLoading(false);
    };

    const handlePaymentSuccess = () => {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Pago realizado. Matrícula completada.',
            showConfirmButton: false,
            timer: 3000
        });
        navigate('/pago-exitoso');
    };

    // Mostrar spinner centrado mientras se verifica el estado del estudiante
    if (step === null) {
        return (
            <LoadingContainer>
                <CircularProgress color="inherit" />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Cargando...
                </Typography>
            </LoadingContainer>
        );
    }

    return (
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
                    <Typography variant="h4" align="center" gutterBottom>Formulario de Matrícula</Typography>
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

            {step === 2 && clientSecret && (
                <Box mt={3}>
                    <Typography variant="h6" align="center" gutterBottom>¡Estudiante registrado! Procede al pago.</Typography>
                    <StripePayment clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
                </Box>
            )}
        </Container>
    );
}

export default MatriculaForm;
