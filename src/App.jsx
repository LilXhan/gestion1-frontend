// App.jsx
import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MatriculaForm from './pages/MatriculaForm';
import PagoExitoso from './components/PagoExitoso';
import Perfil from './pages/Perfil';
import Navbar from './components/Navbar';
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
    const [hasStudent, setHasStudent] = useState(null);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    useEffect(() => {
        const checkStudentAndPayment = async () => {
            if (isAuthenticated) {
                try {
                    const response = await axios.get('/api/matriculas/check-student/');
                    setHasStudent(response.data.has_student);
                    setPaymentCompleted(response.data.payment_completed);
                } catch (error) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'error',
                        title: 'Hubo un problema al verificar el estudiante y el pago.',
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
            }
        };
        checkStudentAndPayment();
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setHasStudent(null);
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
        setDarkMode((prev) => {
            localStorage.setItem('theme', !prev ? 'dark' : 'light');
            return !prev;
        });
    };

    const ProtectedRoute = ({ children }) => (
        isAuthenticated ? children : <Navigate to="/login" replace />
    );

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, handleLogout }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Elements stripe={stripePromise}>
                    <Router>
                        {isAuthenticated && <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />}
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/perfil" element={
                                <ProtectedRoute>
                                    <Perfil />
                                </ProtectedRoute>
                            } />
                            <Route path="/matricula" element={
                                <ProtectedRoute>
                                    {paymentCompleted ? <Navigate to="/pago-exitoso" /> : <MatriculaForm />}
                                </ProtectedRoute>
                            } />
                            <Route path="/pago-exitoso" element={
                                <ProtectedRoute>
                                    <PagoExitoso />
                                </ProtectedRoute>
                            } />
                            <Route path="*" element={<Navigate to={isAuthenticated ? (paymentCompleted ? "/pago-exitoso" : "/matricula") : "/login"} />} />
                        </Routes>
                    </Router>
                </Elements>
            </ThemeProvider>
        </AuthContext.Provider>
    );
}

export default App;
