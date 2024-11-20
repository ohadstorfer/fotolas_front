import { useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { selectLoggedIn, selectToken } from '../slicers/sighnInSlice';
import { selectUser } from '../slicers/userSlice';

const ProtectedRoutesPhotographers = () => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector(selectLoggedIn);
    const conectedUser = useSelector(selectToken);
    const user = useSelector(selectUser)

    if (!user || user?.is_photographer === false) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoutesPhotographers;