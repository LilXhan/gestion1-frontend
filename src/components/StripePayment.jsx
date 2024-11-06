import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button, Box, Typography } from '@mui/material';

function StripePayment({ clientSecret }) {
   const stripe = useStripe();
   const elements = useElements();

   const handlePayment = async () => {
       if (!stripe || !elements) return;

       const cardElement = elements.getElement(CardElement);
       const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
           payment_method: {
               card: cardElement,
           },
       });

       if (error) {
           console.error("Error en el pago:", error);
       } else if (paymentIntent.status === 'succeeded') {
           alert("Pago realizado con éxito. Matrícula completa.");
           window.location.href = '/'; // Redirigir al inicio después del pago exitoso
       }
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
               disabled={!stripe}
           >
               Pagar Ahora
           </Button>
       </Box>
   );
}

export default StripePayment;
