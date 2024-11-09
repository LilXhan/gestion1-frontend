import { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Link, Avatar, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PhotoCamera, Brightness4, Brightness7 } from '@mui/icons-material';
import { AuthContext } from '../App';
import axios from '../utils/axiosConfig';
import Swal from 'sweetalert2';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();
    const { toggleTheme, darkMode } = useContext(AuthContext);

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFotoPerfil(file);
        setPreview(URL.createObjectURL(file));
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
                    elevation={6}
                    sx={{
                        p: 4,
                        borderRadius: 3,
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
                    <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Crear Cuenta
                    </Typography>

                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        mb={2}
                        onClick={() => document.getElementById('upload-photo').click()}
                        sx={{ cursor: 'pointer' }}
                    >
                        <Avatar
                            src={preview}
                            alt="Vista previa"
                            sx={{
                                width: 80,
                                height: 80,
                                mb: 1,
                                bgcolor: darkMode ? '#424242' : '#E0E0E0', 
                                color: darkMode ? '#FFFFFF' : '#000000', 
                            }}
                        >
                            {!preview && <PhotoCamera />}
                        </Avatar>
                        <input
                            id="upload-photo"
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <Box display="flex" alignItems="center">
                            <Typography variant="body2" sx={{ color: darkMode ? '#FFD700' : '#0d6efd' }}>
                                {fotoPerfil ? fotoPerfil.name : "Selecciona tu foto de perfil"}
                            </Typography>
                            <IconButton color="primary" component="span" sx={{ ml: 1 }}>
                                <PhotoCamera sx={{ color: darkMode ? '#FFD700' : '#0d6efd' }} />
                            </IconButton>
                        </Box>
                    </Box>

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
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            Crear Cuenta
                        </Button>
                    </form>

                    <Box mt={3} textAlign="center">
                        <Typography variant="body2">
                            ¿Ya tienes una cuenta?{' '}
                            <Link
                                onClick={() => navigate('/login')}
                                sx={{
                                    cursor: 'pointer',
                                    color: darkMode ? '#FFD700' : '#0d6efd',
                                    textDecoration: 'underline',
                                    fontWeight: 'bold',
                                }}
                            >
                                Iniciar Sesión
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Register;
