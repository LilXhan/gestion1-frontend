import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button, Box, Typography, Container } from '@mui/material';
import Navbar from './Navbar';

function StripePayment({ clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();

    const handlePayment = async () => {
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            console.error("Payment failed:", error);
            alert("Error en el pago: " + error.message);
        } else if (paymentIntent.status === 'succeeded') {
            alert("Pago completado con éxito");
            // Redirigir a la pantalla de confirmación
            window.location.href = "/confirmacion";
        }
    };

    return (
      <>
      <Navbar />
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                <Typography variant="h4" gutterBottom>
                    Realizar Pago
                </Typography>
                <CardElement />
                <Button variant="contained" color="primary" onClick={handlePayment} fullWidth sx={{ mt: 3 }}>
                    Pagar
                </Button>
            </Box>
        </Container>
      </>
    );
}

export default StripePayment;
