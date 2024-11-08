// Login.jsx
import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { AuthContext } from '../App';
import Swal from 'sweetalert2';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Por favor, complete todos los campos.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        try {
            const response = await axios.post('/api/token/', { username, password });
            localStorage.setItem('token', response.data.access);
            setIsAuthenticated(true);
            navigate('/'); // Cambia a '/' para redirigir al InitialRoute
        } catch (error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Credenciales incorrectas. Inténtalo de nuevo.',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Iniciar Sesión
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre de Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
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
