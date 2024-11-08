import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Box, Avatar, Input } from '@mui/material';
import axios from '../utils/axiosConfig';
import Swal from 'sweetalert2';

function Perfil() {
    const [userData, setUserData] = useState({
        nombre: '',
        foto_perfil: ''
    });
    const [newPhoto, setNewPhoto] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/matriculas/perfil/');
                setUserData({
                    nombre: response.data.username,
                    foto_perfil: `http://localhost:8000/${response.data.perfil?.foto_perfil}` // La URL ya viene completa desde el interceptor
                });
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
        setNewPhoto(e.target.files[0]);
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

            // Actualizar la foto de perfil después de guardar los cambios
            setUserData(prevState => ({
                ...prevState,
                foto_perfil: response.data.foto_perfil // La URL ya viene completa desde el interceptor
            }));
            setNewPhoto(null); // Limpiar el archivo seleccionado después de actualizar
        } catch (error) {
            Swal.fire("Error", "No se pudo actualizar el perfil", "error");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>Perfil de Usuario</Typography>
                <Box display="flex" justifyContent="center" mb={2}>
                    <Avatar src={userData.foto_perfil} alt={userData.nombre} sx={{ width: 100, height: 100 }} />
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre"
                        name="nombre"
                        value={userData.nombre}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Input type="file" onChange={handleFileChange} fullWidth sx={{ mt: 2 }} />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Guardar Cambios
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default Perfil;
