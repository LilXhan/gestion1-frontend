// Dashboard.js
import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, Paper, CircularProgress, Box } from '@mui/material';
import axios from '../utils/axiosConfig';
import Swal from 'sweetalert2';

function Dashboard() {
    const [matriculas, setMatriculas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMatriculas = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/matriculas/');
            setMatriculas(response.data);
        } catch (error) {
            console.error('Error en la solicitud de matrícula:', error);
            Swal.fire("Error", "No se pudo cargar la lista de matrículas.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMatriculas();
    }, [fetchMatriculas]);

    const actualizarEstado = async (id, estado) => {
        try {
            await axios.patch(`/api/matriculas/${id}/verificar/`, { estado });
            Swal.fire("Éxito", `Matrícula actualizada a: ${estado}`, "success");
            setMatriculas(prevMatriculas => 
                prevMatriculas.map(m => (m.id === id ? { ...m, estado } : m))
            );
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            Swal.fire("Error", "No se pudo actualizar el estado.", "error");
        }
    };

    return (
        <Container>
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Panel de Administración de Matrículas
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                        <CircularProgress />
                    </Box>
                ) : matriculas.length === 0 ? (
                    <Typography align="center" sx={{ mt: 4, color: 'text.secondary' }}>
                        No hay matrículas para mostrar.
                    </Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Estudiante</TableCell>
                                <TableCell>Curso</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {matriculas.map(matricula => (
                                <TableRow key={matricula.id}>
                                    <TableCell>{matricula.id}</TableCell>
                                    <TableCell>{matricula.estudiante}</TableCell>
                                    <TableCell>{matricula.curso}</TableCell>
                                    <TableCell>{matricula.estado}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => actualizarEstado(matricula.id, 'Aprobado')} color="success">
                                            Aprobar
                                        </Button>
                                        <Button onClick={() => actualizarEstado(matricula.id, 'Rechazado')} color="error">
                                            Rechazar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Paper>
        </Container>
    );
}

export default Dashboard;
