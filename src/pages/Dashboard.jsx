import { useEffect, useState, useCallback } from 'react';
import {
    Container,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    CircularProgress,
    Box,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
    Tooltip,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import { Visibility, CheckCircle, Cancel } from '@mui/icons-material';
import axios from '../utils/axiosConfig';
import Swal from 'sweetalert2';

function Dashboard() {
    const [matriculas, setMatriculas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [certificadoUrl, setCertificadoUrl] = useState('');

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

    const handleOpenDialog = (certificadoUrl) => {
        setCertificadoUrl(certificadoUrl);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCertificadoUrl('');
    };

    const matriculasRechazadas = matriculas.filter(m => m.estado === 'Rechazado').length;
    const matriculasAprobadas = matriculas.filter(m => m.estado === 'Aprobado' && m.pago && m.pago.estado === 'Completado').length;
    const matriculasPendientes = matriculas.filter(m => m.estado === 'Pendiente' || (m.estado === 'Aprobado' && (!m.pago || m.pago.estado === 'Pendiente'))).length;

    return (
        <Container>
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4, borderRadius: 4 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Panel de Administración de Matrículas
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                        <Card sx={{ backgroundColor: '#ffebee' }}>
                            <CardContent>
                                <Typography variant="h6" align="center" color="error" fontWeight="bold">
                                    Rechazados
                                </Typography>
                                <Typography variant="h4" align="center" color="error">
                                    {matriculasRechazadas}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card sx={{ backgroundColor: '#e8f5e9' }}>
                            <CardContent>
                                <Typography variant="h6" align="center" color="success.main" fontWeight="bold">
                                    Aprobados
                                </Typography>
                                <Typography variant="h4" align="center" color="success.main">
                                    {matriculasAprobadas}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card sx={{ backgroundColor: '#fff3e0' }}>
                            <CardContent>
                                <Typography variant="h6" align="center" color="warning.main" fontWeight="bold">
                                    Pendientes
                                </Typography>
                                <Typography variant="h4" align="center" color="warning.main">
                                    {matriculasPendientes}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

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
                                <TableCell align="center">ID</TableCell>
                                <TableCell align="center">Estudiante</TableCell>
                                <TableCell align="center">DNI</TableCell>
                                <TableCell align="center">Grado</TableCell>
                                <TableCell align="center">Estado de Matrícula</TableCell>
                                <TableCell align="center">Estado de Pago</TableCell>
                                <TableCell align="center">Certificado</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {matriculas.map(matricula => (
                                <TableRow key={matricula.id} hover>
                                    <TableCell align="center">{matricula.id}</TableCell>
                                    <TableCell align="center">{matricula.estudiante?.nombre || "No disponible"}</TableCell>
                                    <TableCell align="center">{matricula.estudiante?.dni || "No disponible"}</TableCell>
                                    <TableCell align="center">{matricula.estudiante?.grado || "No disponible"}</TableCell>
                                    <TableCell align="center">
                                        <Typography color={matricula.estado === 'Aprobado' ? 'success.main' : 'error.main'} fontWeight="bold">
                                            {matricula.estado}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography color={matricula.pago && matricula.pago.estado === 'Completado' ? 'success.main' : 'error.main'} fontWeight="bold">
                                            {matricula.pago && matricula.pago.estado === 'Completado' ? 'Completado' : 'Pendiente'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        {matricula.estudiante?.certificado_estudios ? (
                                            <Tooltip title="Ver Certificado">
                                                <IconButton onClick={() => handleOpenDialog(`http://localhost:8000${matricula.estudiante.certificado_estudios}`)}>
                                                    <Visibility sx={{ color: 'info.main' }} />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Typography color="text.secondary">No disponible</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Aprobar Matrícula">
                                            <IconButton 
                                                onClick={() => actualizarEstado(matricula.id, 'Aprobado')} 
                                                color="success" 
                                                disabled={matricula.estado === 'Aprobado'}
                                            >
                                                <CheckCircle />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Rechazar Matrícula">
                                            <IconButton 
                                                onClick={() => actualizarEstado(matricula.id, 'Rechazado')} 
                                                color="error" 
                                                disabled={matricula.estado === 'Rechazado'}
                                            >
                                                <Cancel />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>Certificado de Estudios</DialogTitle>
                    <DialogContent>
                        <Box display="flex" justifyContent="center">
                            <iframe
                                src={certificadoUrl}
                                width="100%"
                                height="600px"
                                title="Certificado de Estudios"
                                style={{ border: 'none' }}
                            />
                        </Box>
                    </DialogContent>
                </Dialog>
            </Paper>
        </Container>
    );
}

export default Dashboard;
