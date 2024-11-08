import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/token/', { username, password });
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('username', username);
            navigate('/matricula');
        } catch (error) {
            console.error('Error en login:', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" align="center">
                    Iniciar Sesión
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField label="Nombre de Usuario" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Iniciar Sesión
                    </Button>
                </form>
                <Box mt={2} textAlign="center">
                    <Typography variant="body2">
                        ¿No tienes una cuenta?{' '}
                        <Link onClick={() => navigate('/register')} sx={{ cursor: 'pointer' }}>
                            Crear cuenta
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default Login;
