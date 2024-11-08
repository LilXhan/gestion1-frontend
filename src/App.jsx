import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MatriculaForm from './pages/MatriculaForm';
import PagoExitoso from './components/PagoExitoso';
import Perfil from './pages/Perfil';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import axios from './utils/axiosConfig';
import Swal from 'sweetalert2';

const stripePromise = loadStripe('pk_test_51QHzDLFE9D0inltwYpJpHqWvqy3yBRpE2Jlvz7clkYYnsJrn5CRtKerERvjac8Fenm1JeftFdTuEJIM4mGNtCGGy0065SBT2Kj');
export const AuthContext = createContext();

function App() {
    const savedTheme = localStorage.getItem('theme') === 'dark';
    const [darkMode, setDarkMode] = useState(savedTheme);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [role, setRole] = useState('');
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [hasStudent, setHasStudent] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    // Verifica el estado del usuario después de la autenticación
    useEffect(() => {
        const checkStatus = async () => {
            if (isAuthenticated) {
                try {
                    const roleResponse = await axios.get('/api/matriculas/role/');
                    setRole(roleResponse.data.role);

                    if (roleResponse.data.role === 'student') {
                        const studentResponse = await axios.get('/api/matriculas/check-student/');
                        setHasStudent(studentResponse.data.has_student);
                        setPaymentCompleted(!studentResponse.data.matricula_rechazada && studentResponse.data.payment_completed);
                    }
                } catch (error) {
                    console.error('Error fetching status:', error);
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'error',
                        title: 'Error al verificar el estado del usuario.',
                        showConfirmButton: false,
                        timer: 3000
                    });
                } finally {
                    setLoadingStatus(false);
                }
            } else {
                setLoadingStatus(false);
            }
        };
        checkStatus();
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setRole('');
        setHasStudent(false);
        setPaymentCompleted(false);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Sesión Cerrada',
            showConfirmButton: false,
            timer: 3000
        });
    };

    const toggleTheme = () => {
        setDarkMode(prev => {
            localStorage.setItem('theme', !prev ? 'dark' : 'light');
            return !prev;
        });
    };

    // Lógica de redirección inicial
    const InitialRoute = () => {
        if (loadingStatus) return null; // Espera a que se complete la carga

        if (!isAuthenticated) return <Navigate to="/login" replace />; // No autenticado

        // Lógica de redirección basada en el rol
        if (role === 'is_staff' || role === 'is_admin') {
            return <Navigate to="/dashboard" replace />;
        }

        // Manejo del rol de estudiante
        if (role === 'student') {
            if (!hasStudent) {
                return <Navigate to="/matricula" replace />; // Redirige a matrícula si no hay estudiante
            }

            if (paymentCompleted) {
                return <Navigate to="/pago-exitoso" replace />;
            }
        }

        return <Navigate to="/login" replace />; // Redirección predeterminada
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, handleLogout }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Elements stripe={stripePromise}>
                    <Router>
                        {isAuthenticated && <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />}
                        <Routes>
                            <Route path="/" element={<InitialRoute />} />
                            <Route path="/dashboard" element={isAuthenticated && (role === 'is_staff' || role === 'is_admin') ? <Dashboard /> : <Navigate to="/" replace />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/perfil" element={isAuthenticated ? <Perfil /> : <Navigate to="/login" replace />} />
                            <Route path="/matricula" element={isAuthenticated && role === 'student' ? <MatriculaForm /> : <Navigate to="/" replace />} />
                            <Route path="/pago-exitoso" element={isAuthenticated && role === 'student' ? <PagoExitoso /> : <Navigate to="/" replace />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </Router>
                </Elements>
            </ThemeProvider>
        </AuthContext.Provider>
    );
}

export default App;
