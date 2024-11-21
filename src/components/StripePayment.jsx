import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from '../utils/axiosConfig';
import Swal from 'sweetalert2';

function StripePayment({ clientSecret, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const [isClientSecretValid, setIsClientSecretValid] = useState(false);

    useEffect(() => {
        if (clientSecret && clientSecret.includes('_secret_')) {
            setIsClientSecretValid(true);
        } else {
            setIsClientSecretValid(false);
            Swal.fire("Error", "El secreto del cliente es inválido. Por favor, recargue la página o contacte con soporte.", "error");
        }
    }, [clientSecret]);

    const handlePayment = async () => {
        if (!stripe || !elements || !isClientSecretValid) return;

        setLoading(true);
        const cardElement = elements.getElement(CardElement);
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            console.error("Error en el pago:", error);
            Swal.fire("Error", "Error en el pago. Por favor, inténtelo de nuevo.", "error");
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            await axios.post(`/api/matriculas/pago/confirmar/${paymentIntent.id}/`);
            Swal.fire("Pago realizado", "Matrícula completada con éxito.", "success");
            onSuccess();
        }

        setLoading(false);
    };

    const cardStyle = {
        style: {
            base: {
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                fontSize: '16px',
                '::placeholder': {
                    color: theme.palette.mode === 'dark' ? '#bbbbbb' : '#888888',
                },
                padding: '12px',
                backgroundColor: theme.palette.mode === 'dark' ? '#444444' : '#ffffff',
                borderRadius: '8px',
                border: `1px solid ${theme.palette.mode === 'dark' ? '#666666' : '#cccccc'}`,
            },
            invalid: {
                color: '#ff4d4f',
            },
        },
    };

    return (
        <Box
            mt={3}
            p={3}
            borderRadius={2}
            sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#f5f5f5',
                boxShadow: theme.palette.mode === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                border: `1px solid ${theme.palette.divider}`
            }}
        >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? '#FFD700' : '#0d6efd' }}>
                Ingresar Información de Pago
            </Typography>
            <Box sx={{ padding: '15px', backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#ffffff', borderRadius: '8px' }}>
                <CardElement options={cardStyle} />
            </Box>
            <Button
                variant="contained"
                fullWidth
                sx={{
                    mt: 3,
                    fontWeight: 'bold',
                    backgroundColor: theme.palette.mode === 'dark' ? '#FFD700' : '#0d6efd',
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? '#FFC107' : '#0056b3',
                    },
                }}
                onClick={handlePayment}
                disabled={!stripe || loading || !isClientSecretValid}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Pagar Ahora"}
            </Button>
        </Box>
    );
}

export default StripePayment;
