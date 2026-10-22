import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
    const location = useLocation();
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
}

export default PrivateRoute;