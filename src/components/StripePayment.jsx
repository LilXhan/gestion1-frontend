import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button, Box, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';

function StripePayment({ clientSecret, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentError, setPaymentError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (!stripe || !elements) return;

        setLoading(true); 
        const cardElement = elements.getElement(CardElement);
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            console.error("Error en el pago:", error);
            setPaymentError(true);
        } else if (paymentIntent.status === 'succeeded') {
            alert("Pago realizado con éxito. Matrícula completa.");
            onSuccess();
        }
        
        setLoading(false);
    };

    return (
        <Box mt={3} p={3} border="1px solid #ccc" borderRadius={2}>
            <Typography variant="h6" gutterBottom>
                Ingresar Información de Pago
            </Typography>
            <CardElement options={{ hidePostalCode: true }} />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handlePayment}
                disabled={!stripe || loading}
            >
                {loading ? <CircularProgress size={24} /> : "Pagar Ahora"}
            </Button>
            <Snackbar open={paymentError} autoHideDuration={6000} onClose={() => setPaymentError(false)}>
                <Alert onClose={() => setPaymentError(false)} severity="error" sx={{ width: '100%' }}>
                    Error en el pago. Por favor, inténtelo de nuevo.
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default StripePayment;
