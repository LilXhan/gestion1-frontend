
import { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Link, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import axios from '../utils/axiosConfig';
import { AuthContext } from '../App';
import Swal from 'sweetalert2';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsAuthenticated, toggleTheme, darkMode } = useContext(AuthContext);
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
        
        const roleResponse = await axios.get('/api/matriculas/role/');
        const userRole = roleResponse.data.role;
        localStorage.setItem('role', userRole);

        setIsAuthenticated(true);

        if (userRole === 'is_staff' || userRole === 'is_superuser') {
            navigate('/dashboard');
        } else {
            navigate('/matricula');
        }
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
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: darkMode ? '#1A1A1D' : '#F5F5F5',
                color: darkMode ? '#FFFFFF' : '#000000',
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        textAlign: 'center',
                        backgroundColor: darkMode ? '#2E2E30' : '#FFFFFF',
                        color: darkMode ? '#FFFFFF' : '#000000',
                    }}
                >
                    <Box display="flex" justifyContent="flex-end">
                        <IconButton onClick={toggleTheme}>
                            {darkMode ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Box>
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                    >
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
                            sx={{
                                '& .MuiInputBase-root': {
                                    color: darkMode ? '#FFFFFF' : '#000000',
                                },
                            }}
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                            sx={{
                                '& .MuiInputBase-root': {
                                    color: darkMode ? '#FFFFFF' : '#000000',
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 3,
                                fontWeight: 'bold',
                                py: 1.2,
                                backgroundColor: darkMode ? '#FFD700' : '#0d6efd',
                                '&:hover': { backgroundColor: darkMode ? '#FFC107' : '#0056b3' },
                            }}
                        >
                            Iniciar Sesión
                        </Button>
                    </form>
                    <Box mt={2} textAlign="center">
                        <Typography variant="body2">
                            ¿No tienes una cuenta?{' '}
                            <Link
                                onClick={() => navigate('/register')}
                                sx={{
                                    cursor: 'pointer',
                                    color: darkMode ? '#FFD700' : '#0d6efd',
                                    textDecoration: 'underline',
                                    fontWeight: 'bold',
                                }}
                            >
                                Crear cuenta
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Login;
