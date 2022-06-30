import {  Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthRoute = () => {
    const user = useSelector(state=>state.user.data);
    return !user.isAuthenticated ? <Outlet /> : <Navigate to={-1}/> ;
}
 
export default AuthRoute;