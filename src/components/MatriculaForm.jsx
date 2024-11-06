import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Container, Paper, Input, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import StripePayment from './StripePayment';

function MatriculaForm() {
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [grado, setGrado] = useState('');
    const [direccion, setDireccion] = useState('');
    const [certificado, setCertificado] = useState(null);
    const [hasEstudiante, setHasEstudiante] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername || 'Usuario');

        const token = localStorage.getItem('token');
        axios.get('http://127.0.0.1:8000/api/matriculas/estudiante/verificar/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            const { exists, client_secret } = response.data;
            setHasEstudiante(exists);
            if (client_secret) {
                setClientSecret(client_secret);
                navigate('/pago'); // Redirige al pago si ya existe un client_secret
            }
        })
        .catch(error => console.error("Error al verificar estudiante:", error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (hasEstudiante) {
            alert("Este usuario ya tiene un estudiante registrado.");
            navigate('/pago');
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
            alert("Estudiante registrado con éxito. ¡Redirigiendo al pago!");
            navigate('/pago');
        } catch (error) {
            console.error("Error en matrícula:", error);
            if (error.response) {
                alert(`Error en matrícula: ${JSON.stringify(error.response.data)}`);
            }
        }
    };

    if (hasEstudiante && clientSecret) {
        return null; // Evita que se muestre el formulario si ya existe el estudiante y está en espera de pago
    }

    return (
        <>
            <Navbar username={username} />
            <Container maxWidth="sm">
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
            </Container>
        </>
    );
}

export default MatriculaForm;
