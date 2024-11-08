import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/matriculas/registro/', { username, email, password });
            alert('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (error) {
            console.error('Error en registro:', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" align="center">
                    Crear Cuenta
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField label="Nombre de Usuario" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Crear Cuenta
                    </Button>
                </form>
                <Box mt={2} textAlign="center">
                    <Typography variant="body2">
                        ¿Ya tienes una cuenta?{' '}
                        <Link onClick={() => navigate('/login')} sx={{ cursor: 'pointer' }}>
                            Iniciar Sesión
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default Register;
