import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MatriculaForm from './pages/MatriculaForm';
import axios from './utils/axiosConfig';
import StripePayment from './components/StripePayment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

function App() {
    const [hasStudent, setHasStudent] = useState(null);
    const stripePromise = loadStripe('pk_test_51QHzDLFE9D0inltwYpJpHqWvqy3yBRpE2Jlvz7clkYYnsJrn5CRtKerERvjac8Fenm1JeftFdTuEJIM4mGNtCGGy0065SBT2Kj');

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
        <Elements stripe={stripePromise}>

        <Router>
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
    );
}

export default App;
