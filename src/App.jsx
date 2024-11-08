import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MatriculaForm from './pages/MatriculaForm';
import StripePayment from './components/StripePayment';
import Navbar from './components/Navbar';  // Importamos el Navbar
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51QHzDLFE9D0inltwYpJpHqWvqy3yBRpE2Jlvz7clkYYnsJrn5CRtKerERvjac8Fenm1JeftFdTuEJIM4mGNtCGGy0065SBT2Kj');  // Reemplaza con tu clave pública de Stripe

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [hasStudent, setHasStudent] = useState(null);

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
        shape: {
            borderRadius: 8,
        },
        typography: {
            fontFamily: 'Roboto, Arial, sans-serif',
        },
    });

    useEffect(() => {
        const checkStudent = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('/matriculas/check-student/');
                    setHasStudent(response.data.has_student);
                } catch (error) {
                    console.error("Error checking student:", error);
                }
            }
        };
        checkStudent();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Elements stripe={stripePromise}>
                <Router>
                    {/* Pasamos darkMode y setDarkMode como props a Navbar */}
                    <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        {hasStudent === true && (
                            <Route path="/matricula" element={<Navigate to="/pago" replace />} />
                        )}
                        <Route path="/matricula" element={<MatriculaForm />} />
                        <Route path="/pago" element={<StripePayment />} />
                        <Route path="*" element={<Navigate to={hasStudent ? "/pago" : "/matricula"} />} />
                    </Routes>
                </Router>
            </Elements>
        </ThemeProvider>
    );
}

export default App;
