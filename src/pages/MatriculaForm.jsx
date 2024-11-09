import { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Stepper, Step, StepLabel, CircularProgress, IconButton } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { UploadFile } from '@mui/icons-material';
import axios from '../utils/axiosConfig';
import StripePayment from '../components/StripePayment';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const steps = ['Registro de Datos', 'Confirmación', 'Pago'];

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
    const [step, setStep] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const initializeForm = async () => {
            try {
                const response = await axios.get('/api/matriculas/check-student/');
                if (response.data.payment_completed && !response.data.matricula_rechazada) {
                    navigate('/matricula-aprobada');
                } else if (response.data.matricula_rechazada) {
                    Swal.fire("Atención", "Tu matrícula ha sido rechazada. Por favor revisa tu información y vuelve a intentar.", "warning");
                    setStep(0);
                } else if (response.data.has_student) {
                    setClientSecret(response.data.client_secret);
                    setStep(2);
                } else {
                    setStep(0);
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
                setStep(0);
            }
        };
        initializeForm();
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setCertificado(file);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Formato no válido',
                text: 'Solo se aceptan archivos en formato PDF.',
                timer: 3000,
                showConfirmButton: false
            });
            e.target.value = null;
        }
    };

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
            <Stepper
                activeStep={step}
                alternativeLabel
                sx={{
                    mt: 4,
                    mb: 4,
                    '.MuiStepLabel-label': {
                        color: theme.palette.mode === 'dark' ? '#FFD700' : '#0d6efd',
                    },
                    '.MuiStepIcon-root': {
                        color: theme.palette.mode === 'dark' ? '#FFD700 !important' : '#0d6efd !important',
                    },
                }}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {step === 0 && (
                <Paper elevation={4} sx={{
                    p: 4,
                    borderRadius: 4,
                    backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1D' : '#FFFFFF',
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.3)',
                    textAlign: 'center'
                }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000' }}>
                        Formulario de Matrícula
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField label="Nombre Completo" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth margin="normal" required />
                        <TextField label="DNI" value={dni} onChange={(e) => setDni(e.target.value)} fullWidth margin="normal" required error={!/^\d{8}$/.test(dni)} helperText={!/^\d{8}$/.test(dni) ? "Ingrese un DNI válido de 8 dígitos" : ""} />
                        <TextField label="Fecha de Nacimiento" type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} fullWidth margin="normal" required InputLabelProps={{ shrink: true }} />
                        <TextField label="Grado" value={grado} onChange={(e) => setGrado(e.target.value)} fullWidth margin="normal" required />
                        <TextField label="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} fullWidth margin="normal" required />
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{ mt: 2, p: 2, border: `1px dashed ${theme.palette.divider}`, cursor: 'pointer', borderRadius: '8px' }}
                            onClick={() => document.getElementById('certificado-input').click()}
                        >
                            <input
                                id="certificado-input"
                                type="file"
                                onChange={handleFileChange}
                                accept="application/pdf"
                                style={{ display: 'none' }}
                            />
                            <IconButton color="primary">
                                <UploadFile sx={{ color: theme.palette.mode === 'dark' ? '#FFD700' : '#0d6efd' }} />
                            </IconButton>
                            <Typography variant="body2" sx={{ ml: 1, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000' }}>
                                {certificado ? certificado.name : "Selecciona tu certificado de estudios (solo PDF)"}
                            </Typography>
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 3,
                                fontWeight: 'bold',
                                py: 1.2,
                                backgroundColor: theme.palette.mode === 'dark' ? '#FFD700' : '#0d6efd',
                                '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? '#FFC107' : '#0056b3' }
                            }}
                            disabled={loading}
                        >
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
