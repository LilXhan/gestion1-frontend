import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Navbar({ darkMode, setDarkMode }) {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');  // Eliminar el token para cerrar sesión
        navigate('/login');  // Redirigir al inicio de sesión
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <AppBar position="static" sx={{ bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'primary.main' }}>
            <Toolbar>
                {/* Sección izquierda - Título de la institución */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                    Colegio San Miguelito
                </Typography>
                
                {/* Sección derecha - Botones de cambio de tema y cierre de sesión */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 2 }}>
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    <Button color="inherit" onClick={handleLogout}>
                        Cerrar Sesión
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
