import { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import axios from '../utils/axiosConfig';
import Swal from 'sweetalert2';

function AdminMatriculas() {
    const [matriculas, setMatriculas] = useState([]);

    useEffect(() => {
        const fetchMatriculas = async () => {
            try {
                const response = await axios.get('/api/admin/matriculas/');
                setMatriculas(response.data);
            } catch (error) {
                Swal.fire("Error", "No se pudo cargar las matrículas.", "error");
            }
        };
        fetchMatriculas();
    }, []);

    const handleUpdate = async (id, nuevoEstado) => {
        try {
            await axios.put(`/api/admin/matriculas/${id}/`, { estado: nuevoEstado });
            Swal.fire("Éxito", "Matrícula actualizada correctamente.", "success");
            setMatriculas(prevMatriculas =>
                prevMatriculas.map(mat => mat.id === id ? { ...mat, estado: nuevoEstado } : mat)
            );
        } catch (error) {
            Swal.fire("Error", "No se pudo actualizar el estado de la matrícula.", "error");
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Verificación de Matrículas</Typography>
            <Box>
                {matriculas.map(matricula => (
                    <Paper key={matricula.id} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6">{matricula.estudiante.nombre}</Typography>
                        <Typography variant="body1">Estado: {matricula.estado}</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleUpdate(matricula.id, 'Aceptada')}
                            sx={{ mr: 1 }}
                        >
                            Aceptar
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleUpdate(matricula.id, 'Rechazada')}
                        >
                            Rechazar
                        </Button>
                    </Paper>
                ))}
            </Box>
        </Container>
    );
}

export default AdminMatriculas;
