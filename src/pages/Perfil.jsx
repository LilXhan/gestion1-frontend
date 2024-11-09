import { useEffect, useState, useContext } from 'react';
import { Container, Typography, TextField, Button, Paper, Box, Avatar, IconButton, Tooltip } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { AuthContext } from '../App';
import axios from '../utils/axiosConfig';
import Swal from 'sweetalert2';

function Perfil() {
    const [userData, setUserData] = useState({
        nombre: '',
        foto_perfil: ''
    });
    const [newPhoto, setNewPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const { darkMode } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/matriculas/perfil/');
                setUserData({
                    nombre: response.data.username,
                    foto_perfil: `http://localhost:8000/${response.data.perfil?.foto_perfil}`
                });
                setPreview(`http://localhost:8000/${response.data.perfil?.foto_perfil}`);
            } catch (error) {
                Swal.fire("Error", "No se pudo cargar la información del usuario.", "error");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewPhoto(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', userData.nombre);
        if (newPhoto) formData.append('foto_perfil', newPhoto);

        try {
            const response = await axios.put('/matriculas/perfil/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire("Éxito", "Perfil actualizado correctamente", "success");
            setUserData(prevState => ({
                ...prevState,
                foto_perfil: response.data.foto_perfil
            }));
            setNewPhoto(null);
        } catch (error) {
            Swal.fire("Error", "No se pudo actualizar el perfil", "error");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{
                p: 4,
                mt: 4,
                borderRadius: 4,
                backgroundColor: darkMode ? '#1A1A1D' : '#FFFFFF',
                color: darkMode ? '#FFFFFF' : '#000000',
                textAlign: 'center',
                boxShadow: '0px 4px 20px rgba(0,0,0,0.3)'
            }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: darkMode ? '#FFFFFF' : '#000000' }}>
                    Perfil de Usuario
                </Typography>

                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mb={3}>
                    <Avatar src={preview} alt={userData.nombre} sx={{ width: 100, height: 100, mb: 2 }} />
                    <Tooltip title="Selecciona tu foto de perfil (clic aquí o en el icono)">
                        <label htmlFor="upload-photo" style={{ cursor: 'pointer' }}>
                            <input
                                id="upload-photo"
                                type="file"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <IconButton color="primary" component="span">
                                <PhotoCamera sx={{ color: darkMode ? '#FFD700' : '#0d6efd' }} />
                            </IconButton>
                        </label>
                    </Tooltip>
                </Box>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre"
                        name="nombre"
                        value={userData.nombre}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            style: { color: darkMode ? '#FFFFFF' : '#000000', backgroundColor: darkMode ? '#3A3A3A' : '#F5F5F5', borderRadius: '5px' }
                        }}
                        InputLabelProps={{
                            style: { color: darkMode ? '#B0B0B0' : '#000000' }
                        }}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            mt: 2,
                            fontWeight: 'bold',
                            py: 1.2,
                            backgroundColor: darkMode ? '#FFD700' : '#0d6efd',
                            '&:hover': { backgroundColor: darkMode ? '#FFC107' : '#0056b3' }
                        }}
                    >
                        Guardar Cambios
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default Perfil;
