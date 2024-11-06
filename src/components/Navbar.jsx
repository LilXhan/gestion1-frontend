import React from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navbar({ username }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('client_secret');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Avatar sx={{ mr: 2 }}>{username ? username.charAt(0).toUpperCase() : '?'}</Avatar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Bienvenido, {username || 'Usuario'}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
