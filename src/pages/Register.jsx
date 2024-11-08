// Register.jsx
import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Link, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import Swal from 'sweetalert2';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (fotoPerfil) {
            formData.append('foto_perfil', fotoPerfil);
        }

        try {
            await axios.post('/api/matriculas/registro/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Cuenta creada con éxito. Ahora puedes iniciar sesión.',
                showConfirmButton: false,
                timer: 3000
            });
            navigate('/login');
        } catch (error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Error en registro. Inténtalo de nuevo.',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" align="center">
                    Crear Cuenta
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField label="Nombre de Usuario" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="normal" required />
                    <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" required />
                    <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" required />
                    <Input type="file" onChange={(e) => setFotoPerfil(e.target.files[0])} fullWidth sx={{ mt: 2 }} />
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
