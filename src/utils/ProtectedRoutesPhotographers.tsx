import { useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { selectLoggedIn, selectToken } from '../slicers/sighnInSlice';

const ProtectedRoutesPhotographers = () => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector(selectLoggedIn);
    const conectedUser = useSelector(selectToken);

    if (!conectedUser || conectedUser?.is_photographer === false) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoutesPhotographers;