import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, TextField, Button, Container, Paper, Input, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePayment from './StripePayment';

const stripePromise = loadStripe('pk_test_51QHzDLFE9D0inltwYpJpHqWvqy3yBRpE2Jlvz7clkYYnsJrn5CRtKerERvjac8Fenm1JeftFdTuEJIM4mGNtCGGy0065SBT2Kj');

function MatriculaForm() {
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [grado, setGrado] = useState('');
    const [direccion, setDireccion] = useState('');
    const [certificado, setCertificado] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [username, setUsername] = useState('');
    const [hasEstudiante, setHasEstudiante] = useState(false);
    const [estudiante, setEstudiante] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername || 'Usuario');

        // Verificar si el estudiante ya existe para el usuario
        const token = localStorage.getItem('token');
        axios.get('http://127.0.0.1:8000/api/matriculas/estudiante/verificar/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            if (response.data.exists) {
                setHasEstudiante(true);
                setEstudiante(response.data.estudiante);  // Guardar información del estudiante
            }
        })
        .catch(error => console.error("Error al verificar estudiante:", error));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Si el estudiante ya existe, no intentamos crear uno nuevo
        if (hasEstudiante) {
            alert("Este usuario ya tiene un estudiante registrado.");
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('dni', dni);
        formData.append('fecha_nacimiento', fechaNacimiento);
        formData.append('grado', grado);
        formData.append('direccion', direccion);
        if (certificado) {
            formData.append('certificado_estudios', certificado);
        } else {
            alert("Por favor, selecciona un archivo para el certificado de estudios.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://127.0.0.1:8000/api/matriculas/estudiante/crear/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const { client_secret } = response.data;
            setClientSecret(client_secret);
            alert("Estudiante registrado con éxito. ¡Ahora puedes proceder al pago!");

        } catch (error) {
            console.error("Error en matrícula:", error);
            if (error.response) {
                alert(`Error en matrícula: ${JSON.stringify(error.response.data)}`);
            }
        }
    };

    return (
        <>
            {/* Navbar */}
            <AppBar position="static" sx={{ mb: 4 }}>
                <Toolbar>
                    <Avatar sx={{ mr: 2 }}>{username.charAt(0).toUpperCase()}</Avatar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Bienvenido, {username}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm">
                {hasEstudiante ? (
                    <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Estudiante registrado: {estudiante.nombre}
                        </Typography>
                        <Elements stripe={stripePromise}>
                            <StripePayment clientSecret={clientSecret} />
                        </Elements>
                    </Paper>
                ) : (
                    <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
                        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                            <Typography variant="h4" component="h1" gutterBottom>
                                Formulario de Matrícula
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField label="Nombre Completo" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth margin="normal" variant="outlined" required />
                                <TextField label="DNI" value={dni} onChange={(e) => setDni(e.target.value)} fullWidth margin="normal" variant="outlined" inputProps={{ maxLength: 8 }} required />
                                <TextField label="Fecha de Nacimiento" type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} fullWidth margin="normal" variant="outlined" InputLabelProps={{ shrink: true }} required />
                                <TextField label="Grado" value={grado} onChange={(e) => setGrado(e.target.value)} fullWidth margin="normal" variant="outlined" required />
                                <TextField label="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} fullWidth margin="normal" variant="outlined" required />
                                <Box mt={2}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Cargar Certificado de Estudios
                                    </Typography>
                                    <Input type="file" onChange={(e) => setCertificado(e.target.files[0])} fullWidth disableUnderline inputProps={{ accept: '.pdf,.jpg,.png' }} />
                                </Box>
                                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                                    Registrar Estudiante
                                </Button>
                            </form>
                        </Box>
                    </Paper>
                )}
            </Container>
        </>
    );
}

export default MatriculaForm;
