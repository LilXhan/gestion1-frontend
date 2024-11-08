import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import Navbar from '../components/Navbar';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePayment from '../components/StripePayment';

const stripePromise = loadStripe('pk_test_51QHzDLFE9D0inltwYpJpHqWvqy3yBRpE2Jlvz7clkYYnsJrn5CRtKerERvjac8Fenm1JeftFdTuEJIM4mGNtCGGy0065SBT2Kj');

function MatriculaForm() {
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [grado, setGrado] = useState('');
    const [direccion, setDireccion] = useState('');
    const [certificado, setCertificado] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const username = localStorage.getItem('username') || 'Usuario';
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            alert('Estudiante registrado con éxito. Ahora puedes proceder al pago.');
        } catch (error) {
            console.error('Error en matrícula:', error);
        }
    };

    return (
        <>
            <Navbar username={username} />
            <Container maxWidth="sm">
                <Paper elevation={4} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        Formulario de Matrícula
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField label="Nombre Completo" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth margin="normal" />
                        <TextField label="DNI" value={dni} onChange={(e) => setDni(e.target.value)} fullWidth margin="normal" />
                        <TextField label="Fecha de Nacimiento" type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
                        <TextField label="Grado" value={grado} onChange={(e) => setGrado(e.target.value)} fullWidth margin="normal" />
                        <TextField label="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} fullWidth margin="normal" />
                        <Input type="file" onChange={(e) => setCertificado(e.target.files[0])} fullWidth margin="normal" sx={{ mt: 2 }} />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Registrar Estudiante
                        </Button>
                    </form>
                    {clientSecret && (
                        <Box mt={3}>
                            <Typography variant="h6" align="center" gutterBottom>
                                ¡Estudiante registrado! Procede al pago.
                            </Typography>
                            <Elements stripe={stripePromise}>
                                <StripePayment clientSecret={clientSecret} onSuccess={() => navigate('/')} />
                            </Elements>
                        </Box>
                    )}
                </Paper>
            </Container>
        </>
    );
}

export default MatriculaForm;
