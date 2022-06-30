import {  Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    const user = useSelector(state=>state.user.data);
    return user.isAuthenticated ? <Outlet /> : <Navigate to={'/auth/login'}/> ;
}
 
export default ProtectedRoute;