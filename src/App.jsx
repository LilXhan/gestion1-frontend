import { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MatriculaForm from './pages/MatriculaForm';
import PagoExitoso from './components/PagoExitoso';
import Perfil from './pages/Perfil';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MatriculaAprobada from './components/MatriculaAprobada'; // Importar el nuevo componente
import ProtectedRoute from './components/ProtectedRoute';
import { Elements } from '@stripe/react-stripe-js';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QHzDLFE9D0inltwYpJpHqWvqy3yBRpE2Jlvz7clkYYnsJrn5CRtKerERvjac8Fenm1JeftFdTuEJIM4mGNtCGGy0065SBT2Kj');

export const AuthContext = createContext();

function App() {
    const savedTheme = localStorage.getItem('theme') === 'dark';
    const [darkMode, setDarkMode] = useState(savedTheme);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [loadingStatus, setLoadingStatus] = useState(true);

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    useEffect(() => {
        setLoadingStatus(false);
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
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

    const InitialRoute = () => {
        return isAuthenticated ? <Navigate to="/matricula" replace /> : <Navigate to="/login" replace />;
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, handleLogout, toggleTheme, darkMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Elements stripe={stripePromise}>
                    <Router>
                        {isAuthenticated && <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />}
                        <Routes>
                            <Route path="/" element={<InitialRoute />} />
                            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
                            <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
                            <Route path="/dashboard" element={
                                <ProtectedRoute allowedRoles={['is_staff', 'is_superuser']}>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/perfil" element={
                                <ProtectedRoute allowedRoles={['authenticated', 'is_staff', 'is_superuser']}>
                                    <Perfil />
                                </ProtectedRoute>
                            } />
                            <Route path="/matricula" element={
                                <ProtectedRoute allowedRoles={['authenticated']}>
                                    <MatriculaForm />
                                </ProtectedRoute>
                            } />
                            <Route path="/pago-exitoso" element={
                                <ProtectedRoute allowedRoles={['authenticated']}>
                                    <PagoExitoso />
                                </ProtectedRoute>
                            } />
                            <Route path="/matricula-aprobada" element={
                                <ProtectedRoute allowedRoles={['authenticated']}>
                                    <MatriculaAprobada />
                                </ProtectedRoute>
                            } />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </Router>
                </Elements>
            </ThemeProvider>
        </AuthContext.Provider>
    );
}

export default App;
