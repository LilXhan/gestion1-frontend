import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../App';

function ProtectedRoute({ allowedRoles, children }) {
    const { isAuthenticated } = useContext(AuthContext);
    const userRole = localStorage.getItem('role');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        if (userRole === 'is_staff' || userRole === 'is_superuser') {
            return <Navigate to="/dashboard" replace />;
        } else if (userRole === 'authenticated') {
            return <Navigate to="/matricula" replace />;
        }
    }

    return children;
}

export default ProtectedRoute;
