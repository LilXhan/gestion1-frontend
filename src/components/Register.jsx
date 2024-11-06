import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
   const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
       e.preventDefault();
       try {
           await axios.post('http://127.0.0.1:8000/api/matriculas/registro/', { username, email, password });
           navigate('/login'); // Redirigir a la página de login
       } catch (error) {
           console.error('Error en registro:', error);
       }
   };

   return (
       <Box
           sx={{
               position: 'fixed',
               top: 0,
               left: 0,
               width: '100vw',
               height: '100vh',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               bgcolor: 'grey.900',
           }}
       >
           <Container maxWidth="xs">
               <Paper elevation={4} sx={{ p: 4, borderRadius: 2, bgcolor: 'grey.100' }}>
                   <Box display="flex" flexDirection="column" alignItems="center">
                       <Typography variant="h4" component="h1" gutterBottom>
                           Crear Cuenta
                       </Typography>
                       <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 8 }}>
                           <TextField label="Nombre de Usuario" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="normal" variant="outlined" />
                           <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" variant="outlined" />
                           <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" variant="outlined" />
                           <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                               Crear Cuenta
                           </Button>
                       </form>
                       <Box mt={2}>
                           <Typography variant="body2">
                               ¿Ya tienes una cuenta?{' '}
                               <Link onClick={() => navigate('/login')} sx={{ cursor: 'pointer' }}>
                                   Iniciar Sesión
                               </Link>
                           </Typography>
                       </Box>
                   </Box>
               </Paper>
           </Container>
       </Box>
   );
}

export default Register;
