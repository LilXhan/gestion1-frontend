// Navbar.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Badge, Tooltip, Menu, MenuItem, Divider } from '@mui/material';
import { Brightness4, Brightness7, Logout, Notifications, AccountCircle, Settings } from '@mui/icons-material';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import Swal from 'sweetalert2';

function Navbar({ darkMode, toggleTheme }) {
    const { handleLogout } = useContext(AuthContext);
    const [userData, setUserData] = useState({ nombre: '', foto_perfil: '' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const navigate = useNavigate();
    
    const [notifications] = useState([
        { id: 1, message: "Nueva actualización disponible", read: false },
        { id: 2, message: "Completa tu perfil para obtener beneficios", read: true },
    ]);

    const theme = {
        primary: darkMode ? '#1A1A1A' : '#FFFFFF',
        textPrimary: darkMode ? '#FFFFFF' : '#2E2E2E',
        highlight: darkMode ? '#3A3A3A' : '#F0F0F0',
        accent: darkMode ? '#FFD700' : '#0d6efd',  // Amarillo en modo oscuro y azul en modo claro
        iconColor: darkMode ? '#FFFFFF' : '#333333' // Blanco para oscuro y gris oscuro para claro
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/matriculas/perfil/');
                setUserData({
                    nombre: response.data.username,
                    foto_perfil: response.data.foto_perfil,
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleProfileMenuClose = () => setAnchorEl(null);

    const handleNotificationsClick = (event) => setNotificationAnchorEl(event.currentTarget);
    const handleNotificationsClose = () => setNotificationAnchorEl(null);

    const confirmLogout = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Vas a cerrar sesión.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: theme.accent,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout();
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Sesión cerrada correctamente',
                    showConfirmButton: false,
                    timer: 3000,
                });
                navigate('/login');
            }
        });
    };

    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: theme.primary,
                padding: '0.6rem 1.2rem',
                borderBottom: `1px solid ${darkMode ? '#333' : '#DDD'}`,
                backdropFilter: 'blur(12px)',
                zIndex: 1301,
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo / Brand Name */}
                <Typography
                    variant="h6"
                    onClick={() => navigate('/')}
                    sx={{
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: theme.textPrimary,
                        textTransform: 'uppercase',
                        '&:hover': {
                            color: theme.accent,
                        },
                        letterSpacing: '1.5px',
                    }}
                >
                    Colegio San Miguelito
                </Typography>

                {/* Right Section: Notifications, Theme Toggle, Profile */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Notifications Icon */}
                    <Tooltip title="Notificaciones" arrow>
                        <IconButton
                            onClick={handleNotificationsClick}
                            sx={{
                                color: theme.iconColor,
                                '&:hover': { color: theme.accent },
                            }}
                        >
                            <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                                <Notifications />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={notificationAnchorEl}
                        open={Boolean(notificationAnchorEl)}
                        onClose={handleNotificationsClose}
                        PaperProps={{
                            elevation: 3,
                            sx: {
                                bgcolor: theme.highlight,
                                color: theme.textPrimary,
                                mt: 1.5,
                                minWidth: 250,
                                borderRadius: '8px',
                            },
                        }}
                    >
                        <Typography variant="h6" sx={{ px: 2, pt: 1 }}>
                            Notificaciones
                        </Typography>
                        <Divider />
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <MenuItem key={notification.id} onClick={handleNotificationsClose} sx={{ bgcolor: notification.read ? 'inherit' : '#f5f5f5' }}>
                                    {notification.message}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem onClick={handleNotificationsClose}>No hay notificaciones</MenuItem>
                        )}
                    </Menu>

                    {/* Theme Toggle Icon */}
                    <Tooltip title="Cambiar tema" arrow>
                        <IconButton onClick={toggleTheme} sx={{ color: theme.iconColor, '&:hover': { color: theme.accent } }}>
                            {darkMode ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Tooltip>

                    {/* Profile Avatar */}
                    <Tooltip title="Cuenta" arrow>
                        <IconButton onClick={handleProfileMenuOpen}>
                            <Avatar
                                alt={userData.nombre}
                                src={userData.foto_perfil}
                                sx={{
                                    width: 38,
                                    height: 38,
                                    border: `2px solid ${theme.accent}`,
                                    '&:hover': {
                                        borderColor: theme.accent,
                                        transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.3s ease-in-out',
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleProfileMenuClose}
                        PaperProps={{
                            elevation: 4,
                            sx: {
                                bgcolor: theme.highlight,
                                color: theme.textPrimary,
                                mt: 1.5,
                                minWidth: 200,
                                borderRadius: '8px',
                            },
                        }}
                    >
                        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/perfil'); }}>
                            <AccountCircle fontSize="small" sx={{ mr: 1, color: theme.iconColor }} />
                            Perfil
                        </MenuItem>
                        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/configuracion'); }}>
                            <Settings fontSize="small" sx={{ mr: 1, color: theme.iconColor }} />
                            Configuración
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={confirmLogout} sx={{ color: '#d32f2f' }}>
                            <Logout fontSize="small" sx={{ mr: 1, color: '#d32f2f' }} />
                            Cerrar Sesión
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
