import { AppBar, Toolbar, Typography, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navbar({ username }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Avatar sx={{ mr: 2 }}>{username.charAt(0).toUpperCase()}</Avatar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Bienvenido, {username}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
